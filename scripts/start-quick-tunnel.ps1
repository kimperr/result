$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue

if (-not $cloudflared) {
  $wingetCloudflared = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\cloudflared.exe"
  if (Test-Path $wingetCloudflared) {
    $cloudflaredPath = $wingetCloudflared
  } else {
    throw "cloudflared not found. Install it with: winget install --id Cloudflare.cloudflared"
  }
} else {
  $cloudflaredPath = $cloudflared.Source
}

$serverHealthUrl = "http://127.0.0.1:8787/health"
$serverUrl = "http://127.0.0.1:8787"
$outLog = Join-Path $repoRoot "cloudflared.out.log"
$errLog = Join-Path $repoRoot "cloudflared.err.log"

function Test-Server {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $serverHealthUrl -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (-not (Test-Server)) {
  Start-Process -FilePath "npm.cmd" `
    -ArgumentList "--workspace @kia-maker/video-server run start" `
    -WorkingDirectory $repoRoot `
    -WindowStyle Hidden

  $serverReady = $false
  for ($i = 0; $i -lt 20; $i += 1) {
    Start-Sleep -Seconds 1
    if (Test-Server) {
      $serverReady = $true
      break
    }
  }

  if (-not $serverReady) {
    throw "Video server did not become ready on $serverUrl"
  }
}

Get-CimInstance Win32_Process -Filter "name = 'cloudflared.exe'" |
  Where-Object { $_.CommandLine -like "*127.0.0.1:8787*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Remove-Item -LiteralPath $outLog, $errLog -ErrorAction SilentlyContinue

Start-Process -FilePath $cloudflaredPath `
  -ArgumentList "tunnel --url $serverUrl --no-autoupdate" `
  -WorkingDirectory $repoRoot `
  -RedirectStandardOutput $outLog `
  -RedirectStandardError $errLog `
  -WindowStyle Hidden

$publicUrl = ""
for ($i = 0; $i -lt 30; $i += 1) {
  Start-Sleep -Seconds 1
  $combinedLog = ""
  if (Test-Path $outLog) { $combinedLog += Get-Content -Raw $outLog }
  if (Test-Path $errLog) { $combinedLog += "`n" + (Get-Content -Raw $errLog) }
  $match = [regex]::Match($combinedLog, "https://[a-zA-Z0-9-]+\.trycloudflare\.com")
  if ($match.Success) {
    $publicUrl = $match.Value
    break
  }
}

if (-not $publicUrl) {
  throw "Could not find a trycloudflare.com URL in cloudflared logs."
}

$healthOk = $false
for ($i = 0; $i -lt 15; $i += 1) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing "$publicUrl/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
      $healthOk = $true
      break
    }
  } catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $healthOk) {
  throw "Cloudflare tunnel URL was created, but health check failed: $publicUrl/health"
}

$configPath = Join-Path $repoRoot "apps\mobile\src\config.js"
"export const DEFAULT_SERVER_URL = '$publicUrl';" | Set-Content -Encoding UTF8 $configPath

Push-Location $repoRoot
try {
  npm.cmd run build:mobile
  if (Test-Path "apps\mobile\android") {
    npm.cmd run cap:sync
  }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "Quick Tunnel is ready:"
Write-Host $publicUrl
Write-Host ""
Write-Host "Health:"
Write-Host "$publicUrl/health"


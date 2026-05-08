$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$env:JAVA_HOME = "D:\android-build-tools\jdk-21"
$env:ANDROID_HOME = "D:\android-build-tools\android-sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\build-tools\35.0.0;$env:Path"

Push-Location (Join-Path $repoRoot "apps\native-android")
try {
  .\gradlew.bat assembleDebug
  $apk = Join-Path $repoRoot "apps\native-android\app\build\outputs\apk\debug\app-debug.apk"
  if (!(Test-Path $apk)) {
    throw "APK was not created: $apk"
  }
  Write-Host "Native APK created:"
  Write-Host $apk
} finally {
  Pop-Location
}


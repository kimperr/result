from __future__ import annotations

import json
import re
from datetime import datetime, timedelta
from html import unescape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urljoin, urlparse
from urllib.request import Request, urlopen


HOST = "127.0.0.1"
PORT = 8765
KBO_BASE = "https://www.koreabaseball.com"
REGISTER_URL = f"{KBO_BASE}/Player/Register.aspx"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36"

TEAM_CODES = {
    "KIA": "HT",
    "\uae30\uc544": "HT",
    "\uae30\uc544 \ud0c0\uc774\uac70\uc988": "HT",
    "KIA Tigers": "HT",
}
TEAM_ALIASES = {
    "KIA": "KIA",
    "\uae30\uc544": "KIA",
    "\uae30\uc544 \ud0c0\uc774\uac70\uc988": "KIA",
    "KIA Tigers": "KIA",
}
PITCHER_KOR = "\ud22c\uc218"
PLAYER_GROUP_HEADERS = {
    "\ud22c\uc218",
    "\ud3ec\uc218",
    "\ub0b4\uc57c\uc218",
    "\uc678\uc57c\uc218",
}


def json_dumps(payload: Any) -> bytes:
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def clean_html_text(value: str) -> str:
    text = re.sub(r"<[^>]+>", "", value or "")
    text = unescape(text)
    text = text.replace("\xa0", " ")
    return re.sub(r"\s+", " ", text).strip()


def normalize_team_name(team: str) -> str:
    return TEAM_ALIASES.get((team or "").strip(), (team or "").strip().upper())


def normalize_team_code(team: str) -> str:
    normalized = (team or "").strip()
    if normalized in TEAM_CODES:
        return TEAM_CODES[normalized]
    if normalized.upper() in TEAM_CODES:
        return TEAM_CODES[normalized.upper()]
    return normalized.upper()


def fetch_text(url: str, data: dict[str, Any] | None = None) -> str:
    encoded = None
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
    }
    if data is not None:
        encoded = urlencode(data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8"
        headers["Referer"] = REGISTER_URL
    request = Request(url, data=encoded, headers=headers, method="POST" if encoded else "GET")
    with urlopen(request, timeout=20) as response:
        return response.read().decode("utf-8", errors="replace")


def extract_hidden_value(html: str, field_name: str) -> str:
    pattern = rf'name="{re.escape(field_name)}"[^>]*value="([^"]*)"'
    match = re.search(pattern, html)
    return unescape(match.group(1)) if match else ""


def fetch_register_snapshot_html(date_value: str, team_code: str) -> str:
    initial_html = fetch_text(REGISTER_URL)
    payload = {
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__LASTFOCUS": "",
        "__VIEWSTATE": extract_hidden_value(initial_html, "__VIEWSTATE"),
        "__VIEWSTATEGENERATOR": extract_hidden_value(initial_html, "__VIEWSTATEGENERATOR"),
        "__EVENTVALIDATION": extract_hidden_value(initial_html, "__EVENTVALIDATION"),
        "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchTeam": team_code,
        "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate": date_value.replace("-", ""),
        "ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnCalendarSelect": "",
    }
    return fetch_text(REGISTER_URL, payload)


def parse_register_snapshot(html: str) -> dict[str, dict[str, str]]:
    players: dict[str, dict[str, str]] = {}
    table_pattern = re.compile(r"<table class=\"tNData\".*?<thead>(.*?)</thead>.*?<tbody>(.*?)</tbody>.*?</table>", re.S)

    for thead_html, tbody_html in table_pattern.findall(html):
        headers = [clean_html_text(item) for item in re.findall(r"<th[^>]*>(.*?)</th>", thead_html, re.S)]
        if len(headers) < 2:
            continue

        group_header = headers[1]
        if group_header not in PLAYER_GROUP_HEADERS:
            continue

        for row_html in re.findall(r"<tr>(.*?)</tr>", tbody_html, re.S):
            cells = re.findall(r"<td[^>]*>(.*?)</td>", row_html, re.S)
            if len(cells) < 2:
                continue

            name_cell = cells[1]
            link_match = re.search(r'href="([^"]+)"', name_cell)
            player_link = unescape(link_match.group(1)) if link_match else ""
            player_name = clean_html_text(name_cell)
            player_id_match = re.search(r"playerId=(\d+)", player_link)
            player_id = player_id_match.group(1) if player_id_match else player_name
            if not player_name:
                continue

            players[player_id] = {
                "playerId": player_id,
                "name": player_name,
                "position": group_header,
                "link": player_link,
            }

    return players


def find_player_in_snapshot(snapshot: dict[str, dict[str, str]], name: str) -> dict[str, str] | None:
    normalized_name = re.sub(r"\s+", "", name or "")
    for player in snapshot.values():
        if re.sub(r"\s+", "", player.get("name", "")) == normalized_name:
            return player
    return None


def extract_stats_tables(html: str) -> list[dict[str, str]]:
    start_match = re.search(r'<div class="player_records">', html)
    if not start_match:
        return []

    section = html[start_match.start() :]
    tables = []
    table_pattern = re.compile(
        r"<table[^>]*class=\"tbl tt[^\"]*\"[^>]*>.*?<thead>.*?<tr>(.*?)</tr>.*?</thead>.*?<tbody>\s*<tr>(.*?)</tr>\s*</tbody>.*?</table>",
        re.S,
    )
    for header_html, row_html in table_pattern.findall(section):
        headers = [clean_html_text(item) for item in re.findall(r"<th[^>]*>(.*?)</th>", header_html, re.S)]
        values = [clean_html_text(item) for item in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row_html, re.S)]
        if headers and values and len(headers) == len(values):
            tables.append(dict(zip(headers, values)))
        if len(tables) >= 2:
            break
    return tables


def build_futures_link(player: dict[str, str]) -> str:
    player_id = player.get("playerId", "")
    if not player_id:
        return ""
    if player.get("position") == PITCHER_KOR:
        return f"/Futures/Player/PitcherDetail.aspx?playerId={player_id}"
    return f"/Futures/Player/HitterDetail.aspx?playerId={player_id}"


def format_ops(obp: str, slg: str) -> str:
    try:
        return f"{float(obp) + float(slg):.3f}"
    except (TypeError, ValueError):
        return ""


def fetch_search_player(name: str) -> dict[str, Any]:
    payload = urlencode({"name": name}).encode("utf-8")
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json;q=0.9,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": REGISTER_URL,
    }
    request = Request(f"{KBO_BASE}/ws/Controls.asmx/GetSearchPlayer", data=payload, headers=headers, method="POST")
    with urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8", errors="replace"))


def choose_search_player(search_result: dict[str, Any], name: str) -> dict[str, Any] | None:
    now_players = list(search_result.get("now") or [])
    normalized_name = re.sub(r"\s+", "", name or "")
    for player in now_players:
        player_name = re.sub(r"\s+", "", str(player.get("P_NM", "")))
        if player_name == normalized_name and "/Record/Player/" in str(player.get("P_LINK", "")):
            return player
    for player in now_players:
        if "/Record/Player/" in str(player.get("P_LINK", "")):
            return player
    return now_players[0] if now_players else None


def parse_player_stats(link: str, position_hint: str, league: str = "major") -> tuple[str, dict[str, str]]:
    html = fetch_text(urljoin(KBO_BASE, link))
    tables = extract_stats_tables(html)
    is_pitcher = "PitcherDetail" in link or position_hint == PITCHER_KOR

    if is_pitcher:
        first = tables[0] if len(tables) > 0 else {}
        second = tables[1] if len(tables) > 1 else {}
        if not first.get("G"):
            return ("pitcher", {})
        return (
            "pitcher",
            {
                "games": first.get("G", "0"),
                "wins": first.get("W", "0"),
                "losses": first.get("L", "0"),
                "saves": first.get("SV", "0"),
                "holds": first.get("HLD", "0"),
                "innings": first.get("IP", "0"),
                "era": first.get("ERA", "0"),
                "whip": second.get("WHIP", "0"),
            },
        )

    first = tables[0] if len(tables) > 0 else {}
    second = tables[1] if len(tables) > 1 else {}
    if not first.get("G"):
        return ("hitter", {})
    return (
        "hitter",
        {
            "games": first.get("G", "0"),
            "homeRuns": first.get("HR", "0"),
            "rbi": first.get("RBI", "0"),
            "steals": first.get("SB", "0"),
            "avg": first.get("AVG", "0"),
            "ops": format_ops(first.get("OBP", ""), first.get("SLG", "")) if league == "futures" else second.get("OPS", "0"),
        },
    )


def enrich_snapshot_player(player: dict[str, str], warnings: list[str], record_source: str) -> dict[str, Any]:
    stats_type = "pitcher" if player.get("position") == PITCHER_KOR else "hitter"
    stats: dict[str, str] = {}
    player_link = build_futures_link(player) if record_source == "futures" else player.get("link", "")
    if player_link:
        try:
            stats_type, stats = parse_player_stats(player_link, player.get("position", ""), record_source)
        except Exception:
            if record_source == "major":
                warnings.append(f"Could not parse season stats for {player.get('name', 'unknown player')}. Filled name only.")

    return {
        "playerId": player.get("playerId", ""),
        "name": player.get("name", ""),
        "position": player.get("position", ""),
        "statsType": stats_type,
        "stats": stats,
        "link": player_link,
        "recordSource": record_source,
    }


def build_single_player_payload(name: str, section: str, date_value: str) -> dict[str, Any]:
    player = None
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_value):
        team_code = normalize_team_code("KIA")
        selected_date = datetime.strptime(date_value, "%Y-%m-%d").date()
        previous_date = selected_date - timedelta(days=1)
        current_snapshot = parse_register_snapshot(fetch_register_snapshot_html(date_value, team_code))
        previous_snapshot = parse_register_snapshot(fetch_register_snapshot_html(previous_date.isoformat(), team_code))
        player = find_player_in_snapshot(current_snapshot if section == "callUp" else previous_snapshot, name)

    if not player:
        search_result = fetch_search_player(name)
        searched_player = choose_search_player(search_result, name)
        if searched_player:
            player = {
                "playerId": str(searched_player.get("P_ID", "")),
                "name": str(searched_player.get("P_NM", name)),
                "position": str(searched_player.get("POS_NO", "")),
                "link": str(searched_player.get("P_LINK", "")),
            }

    if not player:
        raise ValueError("해당 이름의 현역 선수를 찾지 못했습니다.")

    record_source = "futures" if section == "callUp" else "major"
    warnings: list[str] = []
    enriched = enrich_snapshot_player(player, warnings, record_source)
    return {
        "name": name,
        "section": section,
        "date": date_value,
        "player": enriched,
        "warnings": warnings,
    }


def build_roster_payload(date_value: str, team: str) -> dict[str, Any]:
    team_code = normalize_team_code(team)
    selected_date = datetime.strptime(date_value, "%Y-%m-%d").date()
    previous_date = selected_date - timedelta(days=1)

    current_html = fetch_register_snapshot_html(date_value, team_code)
    previous_html = fetch_register_snapshot_html(previous_date.isoformat(), team_code)

    current_snapshot = parse_register_snapshot(current_html)
    previous_snapshot = parse_register_snapshot(previous_html)

    call_up_ids = [player_id for player_id in current_snapshot if player_id not in previous_snapshot]
    send_down_ids = [player_id for player_id in previous_snapshot if player_id not in current_snapshot]

    warnings: list[str] = []
    call_up = [enrich_snapshot_player(current_snapshot[player_id], warnings, "futures") for player_id in call_up_ids]
    send_down = [enrich_snapshot_player(previous_snapshot[player_id], warnings, "major") for player_id in send_down_ids]

    return {
        "date": date_value,
        "previousDate": previous_date.isoformat(),
        "team": normalize_team_name(team),
        "teamCode": team_code,
        "callUp": call_up,
        "sendDown": send_down,
        "warnings": warnings,
        "snapshotCounts": {
            "current": len(current_snapshot),
            "previous": len(previous_snapshot),
        },
        "source": "KBO register snapshot diff",
    }


class Handler(BaseHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"KBO proxy is running. Use /api/kbo/roster-moves?date=YYYY-MM-DD&team=KIA")
            return

        if parsed.path != "/api/kbo/roster-moves":
            if parsed.path != "/api/kbo/player-stats":
                self.send_error_json(404, "Unsupported path.")
                return

            query = parse_qs(parsed.query)
            name = (query.get("name") or [""])[0].strip()
            section = (query.get("section") or ["callUp"])[0].strip() or "callUp"
            date_value = (query.get("date") or [""])[0].strip()
            if not name:
                self.send_error_json(400, "name is required.")
                return
            if section not in {"callUp", "sendDown"}:
                self.send_error_json(400, "section must be callUp or sendDown.")
                return

            try:
                payload = build_single_player_payload(name, section, date_value)
            except HTTPError as error:
                self.send_error_json(error.code or 502, f"KBO request failed: {error.reason}")
                return
            except URLError as error:
                self.send_error_json(502, f"KBO connection failed: {error.reason}")
                return
            except Exception as error:
                self.send_error_json(500, f"Proxy processing failed: {error}")
                return

            body = json_dumps(payload)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        query = parse_qs(parsed.query)
        date_value = (query.get("date") or [""])[0].strip()
        team = (query.get("team") or ["KIA"])[0].strip() or "KIA"
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_value):
            self.send_error_json(400, "date must use YYYY-MM-DD format.")
            return

        try:
            payload = build_roster_payload(date_value, team)
        except HTTPError as error:
            self.send_error_json(error.code or 502, f"KBO request failed: {error.reason}")
            return
        except URLError as error:
            self.send_error_json(502, f"KBO connection failed: {error.reason}")
            return
        except Exception as error:
            self.send_error_json(500, f"Proxy processing failed: {error}")
            return

        body = json_dumps(payload)
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status_code: int, message: str) -> None:
        body = json_dumps({"error": message})
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: Any) -> None:
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"KBO proxy listening on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

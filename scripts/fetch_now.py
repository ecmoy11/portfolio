#!/usr/bin/env python3
"""
Builds data/now.json for the Side Quests live cards.

Design rule: every feed is independent and failure-tolerant. If a token
expires or an API changes shape, that feed keeps its previously-fetched
values and the rest of the file still updates. Nothing here ever raises
out to the workflow, so a broken feed does not turn into a red build.

Stdlib only. No pip install step, nothing to keep patched.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "now.json")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " \
     "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"

warnings = []


def log(msg):
    print(msg, file=sys.stderr)


def get_json(url, headers=None, data=None, timeout=25):
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    req.add_header("User-Agent", UA)
    req.add_header("Accept", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def now_iso():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def env(name):
    v = os.environ.get(name, "").strip()
    return v or None


# --------------------------------------------------------------------- #
# Duolingo — unofficial public endpoint. No official API exists, so this
# is the one most likely to break. Optional DUOLINGO_JWT is supported in
# case the anonymous read gets locked down.
# --------------------------------------------------------------------- #
def fetch_duolingo():
    user = env("DUOLINGO_USERNAME")
    if not user:
        return None, "duolingo: DUOLINGO_USERNAME not set, skipping"

    # NOTE: do NOT add a &fields= filter. As of Aug 2026 Duolingo returns a
    # bare {} for ANY fields value, filtered or not. Unfiltered works and
    # already contains streak, streakData, totalXp, courses, currentCourseId.
    url = ("https://www.duolingo.com/2017-06-30/users?username="
           + urllib.parse.quote(user))
    headers = {}
    jwt = env("DUOLINGO_JWT")
    if jwt:
        headers["Authorization"] = "Bearer " + jwt

    payload = get_json(url, headers=headers)
    users = payload.get("users") or []
    if not users:
        return None, "duolingo: no user returned for '%s' (is the profile public?)" % user
    u = users[0]

    streak = u.get("streak")
    sd = (u.get("streakData") or {}).get("currentStreak") or {}
    if streak is None:
        streak = sd.get("length")
    if streak is None:
        return None, "duolingo: response had no streak field"

    course = None
    cid = u.get("currentCourseId")
    for c in (u.get("courses") or []):
        if cid and c.get("id") == cid:
            course = c
            break
    if course is None and u.get("courses"):
        course = max(u["courses"], key=lambda c: c.get("xp") or 0)

    language = (course or {}).get("title") or ""

    # Week dots are derived from the streak itself: if the streak covers the
    # last N days, those days are lit. Honest, and needs no extra endpoint.
    week = [False] * 7
    end = sd.get("endDate")
    covered = min(int(streak), 7)
    lit_through = 6
    if end:
        try:
            end_d = datetime.strptime(end, "%Y-%m-%d").date()
            gap = (datetime.now(timezone.utc).date() - end_d).days
            lit_through = 6 - max(0, min(gap, 7))
        except ValueError:
            pass
    for i in range(covered):
        idx = lit_through - i
        if 0 <= idx < 7:
            week[idx] = True

    # Avatar. The API hands back a protocol-relative URL on the "bg" render
    # template, which bakes a solid colour tile in behind the character. The
    # card needs the character free-standing so it can bleed off the bottom
    # edge, so swap to the "default" template and drop BackgroundColor (only
    # valid on "bg"). Sizes: small|medium|large|xlarge|xlarge400|xxlarge.
    # Derived fresh every run, so editing the avatar in the app just works.
    avatar = None
    pic = (u.get("picture") or "").strip()
    if pic:
        if pic.startswith("//"):
            pic = "https:" + pic
        pic = pic.replace("/static/render/bg/", "/static/render/default/")
        pic = re.sub(r"BackgroundColor-\d+/", "", pic)
        avatar = pic.rstrip("/") + "/xxlarge"

    return {
        "streak": int(streak),
        "xp": u.get("totalXp"),
        "language": language,
        "week": week,
        "avatar": avatar,
        "profile": "https://www.duolingo.com/profile/" + urllib.parse.quote(user),
        "fetched": now_iso(),
    }, None


# --------------------------------------------------------------------- #
# Strava — OAuth refresh flow. Needs the three secrets.
# --------------------------------------------------------------------- #
def _fmt_hms(seconds):
    seconds = int(seconds or 0)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    return ("%d:%02d:%02d" % (h, m, s)) if h else ("%d:%02d" % (m, s))


def fetch_strava():
    cid = env("STRAVA_CLIENT_ID")
    secret = env("STRAVA_CLIENT_SECRET")
    refresh = env("STRAVA_REFRESH_TOKEN")
    if not (cid and secret and refresh):
        return None, "strava: client id/secret/refresh token not all set, skipping"

    body = urllib.parse.urlencode({
        "client_id": cid,
        "client_secret": secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh,
    }).encode()
    tok = get_json("https://www.strava.com/api/v3/oauth/token", data=body)
    access = tok.get("access_token")
    if not access:
        return None, "strava: token refresh returned no access_token"
    if tok.get("refresh_token") and tok["refresh_token"] != refresh:
        warnings.append(
            "strava: refresh token ROTATED. Update the STRAVA_REFRESH_TOKEN "
            "repo secret to: " + tok["refresh_token"][:6] + "... (see setup doc)")

    acts = get_json(
        "https://www.strava.com/api/v3/athlete/activities?per_page=30",
        headers={"Authorization": "Bearer " + access})
    if not isinstance(acts, list) or not acts:
        return None, "strava: no activities returned"

    a = acts[0]
    athlete_id = (a.get("athlete") or {}).get("id")
    dist_km = (a.get("distance") or 0) / 1000.0
    moving = a.get("moving_time") or 0
    kind = a.get("sport_type") or a.get("type") or "Activity"

    pace = None
    if dist_km > 0.05 and moving > 0:
        if kind in ("Ride", "VirtualRide", "EBikeRide", "Velomobile", "Handcycle"):
            pace = "%.1f km/h" % (dist_km / (moving / 3600.0))
        else:
            per_km = moving / dist_km
            pace = "%d:%02d /km" % (int(per_km // 60), int(per_km % 60))

    # last 7 days including today, oldest first
    today = datetime.now(timezone.utc).date()
    buckets = {(today - timedelta(days=i)): 0.0 for i in range(7)}
    for act in acts:
        raw = act.get("start_date_local") or act.get("start_date") or ""
        try:
            d = datetime.strptime(raw[:10], "%Y-%m-%d").date()
        except ValueError:
            continue
        if d in buckets:
            buckets[d] += (act.get("distance") or 0) / 1000.0
    week_days = [round(buckets[today - timedelta(days=i)], 2) for i in range(6, -1, -1)]

    return {
        "name": a.get("name"),
        "type": kind,
        "distance_km": round(dist_km, 2),
        "moving_time": _fmt_hms(moving),
        "pace": pace,
        "date": a.get("start_date"),
        "polyline": ((a.get("map") or {}).get("summary_polyline") or ""),
        "week_days": week_days,
        "week_km": round(sum(week_days), 2),
        "profile": ("https://www.strava.com/athletes/%s" % athlete_id) if athlete_id else None,
        "fetched": now_iso(),
    }, None


# --------------------------------------------------------------------- #
# Last.fm — scrobbles from Spotify. Simpler than Spotify's own OAuth and
# it gives a real "playing now" flag.
# --------------------------------------------------------------------- #
def fetch_listening():
    key = env("LASTFM_API_KEY")
    user = env("LASTFM_USER")
    if not (key and user):
        return None, "listening: LASTFM_API_KEY / LASTFM_USER not set, skipping"

    url = ("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks"
           "&user=" + urllib.parse.quote(user)
           + "&api_key=" + urllib.parse.quote(key)
           + "&format=json&limit=1")
    payload = get_json(url)
    tracks = ((payload.get("recenttracks") or {}).get("track")) or []
    if isinstance(tracks, dict):
        tracks = [tracks]
    if not tracks:
        return None, "listening: no recent tracks"
    t = tracks[0]

    art = ""
    for img in (t.get("image") or []):
        if img.get("#text"):
            art = img["#text"]  # last non-empty is the largest
    if "2a96cbd8b46e442fc41c2b86b821562f" in art:  # last.fm's grey placeholder
        art = ""

    return {
        "track": t.get("name"),
        "artist": (t.get("artist") or {}).get("#text"),
        "album": (t.get("album") or {}).get("#text"),
        "art": art,
        "url": t.get("url"),
        "nowplaying": bool((t.get("@attr") or {}).get("nowplaying")),
        "fetched": now_iso(),
    }, None


# Strava and listening are still fetched by the functions above but are NOT in
# this list as of 2026-08-15: their cards are commented out in side-quests.html
# because the designs are not finished. Leaving them in FEEDS would keep writing
# feed data into now.json that nothing renders, and would warn on every run for
# missing secrets. To bring either card back, uncomment its entry here AND its
# markup + render call in side-quests.html.
FEEDS = [
    ("duolingo", fetch_duolingo),
    # ("strava", fetch_strava),
    # ("listening", fetch_listening),
]


def main():
    try:
        with open(OUT, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (IOError, ValueError):
        data = {}

    got_anything = False
    for name, fn in FEEDS:
        try:
            result, skip = fn()
        except urllib.error.HTTPError as e:
            result, skip = None, "%s: HTTP %s %s" % (name, e.code, e.reason)
        except Exception as e:  # noqa: BLE001 - never fail the build on one feed
            result, skip = None, "%s: %s" % (name, e)

        if result:
            data[name] = result
            got_anything = True
            log("ok   %s" % name)
        else:
            warnings.append(skip or ("%s: no data" % name))
            if name in data:
                log("keep %s (kept last known values)" % name)
            else:
                log("miss %s" % name)

    if got_anything:
        data.pop("placeholder", None)
    data["updated"] = now_iso()
    if warnings:
        data["warnings"] = warnings
    else:
        data.pop("warnings", None)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    for w in warnings:
        log("WARN " + w)
    log("wrote %s" % OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())

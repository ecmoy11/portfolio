# Side Quests — live cards setup

Three cards on `side-quests.html` read from `data/now.json`, which a GitHub
Action rewrites every 4 hours. Until you do the steps below, those cards
**do not appear on the live site** — `now.json` ships with sample values
flagged `"placeholder": true`, and the page suppresses placeholder data on
any non-localhost domain. So nothing fake can leak out. Open the file
locally (`python3 -m http.server`) and you'll see the sample layout.

Total setup time is about 25 minutes, most of it Strava.

---

## What's where

| File | Who edits it |
|---|---|
| `data/now.json` | The Action. Don't hand-edit; it gets overwritten. |
| `data/reading.json` | **You**, whenever you start a new book. |
| `scripts/fetch_now.py` | Only if an API changes. Stdlib Python, no deps. |
| `.github/workflows/now.yml` | Change the `cron:` line to refresh more or less often. |

---

## 1. Duolingo (2 min)

Only needs your username. Yours is **`ecmoy1`** (from https://www.duolingo.com/profile/ecmoy1).

Add it as a repo **variable** (not a secret), name `DUOLINGO_USERNAME`, value `ecmoy1`.

**Check it works in 10 seconds before you bother with anything else** — paste this into a browser tab:

```
https://www.duolingo.com/2017-06-30/users?username=ecmoy1
```

If you get JSON with a `streak` number in it, the card will work. If you get `{"users": []}` or an error, the anonymous endpoint is closed and you will need the `DUOLINGO_JWT` secret (or drop the card to a plain link — see below).

**Verified working 2026-08-06** — returned streak 264, totalXp 12658, courses Spanish/Greek/French. No `DUOLINGO_JWT` needed.

⚠️ **Do NOT add a `&fields=` parameter to that URL.** The script originally used
one and Duolingo now returns a bare `{}` for *any* `fields` value. Unfiltered is
the working call and already includes everything the card needs. This cost an
hour of "the endpoint must be dead" — it wasn't.

⚠️ **Straight with you:** Duolingo has no public API. This uses an
undocumented endpoint that community projects have relied on for years, but
it is unsupported and Duolingo can change it whenever they like. I couldn't
test it from here — this session's sandbox has no outbound network to
duolingo.com — so the first workflow run is the real test. If it comes back
empty, the script logs a warning, the card just doesn't render, and nothing
else breaks. There's an optional `DUOLINGO_JWT` secret wired up in case they
lock anonymous reads down; you'd grab that from your browser's cookies.

**If Duolingo never works:** the card is already clickable through to
`duolingo.com/profile/ecmoy1`, so the cheap fallback is to delete the live
figure and keep it as a styled link out. That is very likely all the mchiu
site is doing anyway.

## 2. Strava (15 min — the fiddly one)

1. Go to <https://www.strava.com/settings/api>, create an app. Set
   **Authorization Callback Domain** to `localhost`.
2. Copy the **Client ID** and **Client Secret**.
3. Paste this in your browser with your client ID substituted in:

   ```
   https://www.strava.com/oauth/authorize?client_id=YOUR_ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all
   ```

4. Approve. The browser lands on a page that won't load — that's expected.
   Copy the `code=...` value out of the address bar.
5. Trade that code for a refresh token:

   ```bash
   curl -X POST https://www.strava.com/api/v3/oauth/token \
     -d client_id=YOUR_ID \
     -d client_secret=YOUR_SECRET \
     -d code=THE_CODE_FROM_STEP_4 \
     -d grant_type=authorization_code
   ```

6. From the JSON that comes back, copy `refresh_token`.

Add three **secrets**: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`,
`STRAVA_REFRESH_TOKEN`.

The code from step 4 is single-use and expires fast — if step 5 errors, just
redo step 3.

**One gotcha:** Strava occasionally rotates the refresh token. The script
detects this and writes a loud warning into the Action log and into
`now.json` under `"warnings"`, telling you to update the secret. It doesn't
happen often, but if the card ever goes stale, check there first.

## 3. In Rotation — music (5 min)

Via Last.fm rather than Spotify directly. Spotify's API would need its own
OAuth dance and gives you a token that expires; Last.fm gives a plain API key
that doesn't, and a real "playing now" flag.

1. Connect Spotify to Last.fm so your plays scrobble: Last.fm → Settings →
   Applications → Spotify.
2. Get an API key at <https://www.last.fm/api/account/create> (the form asks
   for an app name and callback URL — any values are fine).
3. Add secret `LASTFM_API_KEY` and variable `LASTFM_USER` (your Last.fm
   username).

## 4. In Rotation — books (30 sec, ongoing)

Hand-edit `data/reading.json`:

```json
{
  "title": "Thinking in Systems",
  "author": "Donella Meadows",
  "cover": "https://covers.openlibrary.org/b/isbn/9781603580557-L.jpg"
}
```

For the cover, swap the ISBN-13 into that Open Library URL. Check it loads in
a browser first — Open Library doesn't have every edition. If it 404s, either
try a different edition's ISBN or set `"cover": ""` and the card falls back to
title and author alone.

No API here on purpose. Goodreads killed its API, StoryGraph doesn't have one,
and the alternatives are worth less than the 30 seconds it takes to type a
title.

---

## 5. Wire up GitHub

**Settings → Secrets and variables → Actions**

*Variables* tab:

- `DUOLINGO_USERNAME`
- `LASTFM_USER`

*Secrets* tab:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`
- `LASTFM_API_KEY`
- `DUOLINGO_JWT` — optional, only if Duolingo starts refusing

**Settings → Actions → General → Workflow permissions** → set to
**Read and write permissions**. Without this the Action fetches fine but can't
push the result, and you'll get a failed run at the last step.

Then: **Actions** tab → *Refresh Side Quests data* → **Run workflow**.

Watch that first run. The log prints one line per feed:

```
ok   duolingo
keep strava        (kept last known values)
miss listening
WARN listening: LASTFM_API_KEY / LASTFM_USER not set, skipping
```

A feed that fails never fails the build — it keeps whatever it last fetched
and the other two still update. So a dead Duolingo endpoint won't take your
Strava card down with it.

---

## Things worth knowing

**Commit noise.** Every refresh that changes data pushes a commit and
triggers a Pages rebuild. At 4-hour intervals that's up to 6 commits a day.
If that bothers you in the repo history, change the cron in `now.yml` to
`"17 */12 * * *"` — the tradeoff is a "now playing" track that can be half a
day old, so also consider dropping the `nowplaying` wording.

**Scheduled workflows and dormant repos.** GitHub disables cron workflows in
repos with no activity for 60 days. This one commits to itself, so it counts
as activity and stays alive on its own.

**GitHub's cron drifts.** Scheduled runs fire late under load, sometimes by
20+ minutes. Doesn't matter here — the timestamps on the cards are relative
("3h ago"), so lateness reads as accurate rather than broken.

**If you want a card gone,** delete its block from `side-quests.html` (search
for `id="card-duolingo"` etc.) and its function from `FEEDS` in
`fetch_now.py`. Nothing else references them.

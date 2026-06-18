# Asset production list

Master checklist of motion, interaction, and 3D assets to create — for the homepage grid tiles and the case studies behind them. Tile specs at the bottom.

Priorities: **P1** = visible on the homepage, do first. **P2** = strengthens a case study. **P3** = nice to have.

---

## 1. Airline Interaction Design 2036

Your lead tile and most cinematic project — this one deserves the most production effort.

### Motion
- [ ] **P1 — Homepage tile loop** (`assets/tiles/airline-2036.mp4`, 21:9): slow push through your strongest future-state moment, e.g. the system anticipating a disruption before the passenger knows
- [ ] **P2 — Disruption recovery sequence**: animated timeline showing the system rebooking/notifying in the background vs. the passenger's calm foreground experience
- [ ] **P3 — "2036 ambient UI" mood loop**: subtle idle-state animation of the anticipatory interface breathing

### Interaction
- [ ] **P2 — Click-through of the agency moments**: record the interactions where the passenger overrides or redirects the AI (this is your thesis — agency vs. automation — show it interactively)
- [ ] **P3 — Figma prototype embed** in the case study so visitors can tap through themselves

### 3D
- [ ] **P2 — Sci-fi prototype environment** (Blender or Unity): a cabin seat-back or airport wayfinding moment rendered in 3D. Even one hero render elevates a futures project enormously
- [ ] **P3 — Camera-move flythrough** of that environment as a 6-second clip for the case study header

---

## 2. Solace Health

Systems/process work — the challenge is making org design *visible*. Motion is your friend here; 3D would feel forced, skip it.

### Motion
- [ ] **P1 — Tile loop** (`assets/tiles/solace-pulse.mp4`, 4:3): cursor moving through the Pulse tool, AI summary expanding
- [ ] **P2 — Misalignment becoming visible**: animate the framework canvas — cells filling in, a red flag surfacing before it compounds. This is the core story told in 10 seconds
- [ ] **P3 — Before/after timeline**: the problem-timeline graphic animated from chaos to coordinated

### Interaction
- [ ] **P2 — Pulse tool walkthrough recording**: full flow from Slack ping → Pulse dashboard → Jira sync, recorded as one continuous take
- [ ] **P3 — Clickable framework canvas** so a hiring manager can poke at the artifact

### 3D
- Skip. Nothing here needs it.

---

## 3. COROS

Hardware + service. This is your best 3D opportunity — there's a physical watch.

### Motion
- [ ] **P1 — Tile loop** (`assets/tiles/coros-cycle.mp4`, 4:3): phone-frame recording scrolling the cycle-aware Today dashboard
- [ ] **P2 — Phase transition animation**: the dashboard shifting from follicular → luteal, training recommendations adapting. The whole concept in one loop
- [ ] **P3 — Data connection visual**: cycle data flowing into training load, animated

### Interaction
- [ ] **P2 — Prototype recording of the onboarding flow**: setting up cycle tracking for the first time
- [ ] **P3 — Watch-face interaction**: how the wrist surface reflects the phase (even as motion mockup)

### 3D
- [ ] **P2 — Blender render of the COROS watch** showing your redesigned watch face — turntable loop on dark background. Would also make a killer tile if you want to swap it in
- [ ] **P3 — Exploded view** of watch + app + service layers as a systems diagram in 3D

---

## 4. Airbnb Group Booking

### Motion
- [ ] **P1 — Tile loop** (`assets/tiles/airbnb-group.mp4`, 21:9): the cost-splitting moment — amounts dividing across faces/avatars. Fallback: slow pan across screens-overview
- [ ] **P2 — Group join flow animation**: invites going out, members landing in the hub, beds getting assigned
- [ ] **P3 — Split-methods micro-interaction**: toggling between equal / by-room / custom splits

### Interaction
- [ ] **P2 — Two-perspective recording**: same trip from the organizer's view and a member's view, side by side. Shows you designed for *every* traveler's agency, not just the admin
- [ ] **P3 — Figma prototype embed** of the payment join flow

### 3D
- Skip, unless you want a P3 isometric "group trip" scene for the case study header. Low value vs. effort.

---

## 5. WorkTrip

The scrappy self-initiated one — production value should match the story: fast, real, before/after.

### Motion
- [ ] **P1 — Tile loop** (`assets/tiles/worktrip.mp4`, 4:3): 2-second shot of a paper form, hard cut to the digital request flow. The whole pitch in one cut
- [ ] **P3 — Approval-chain animation**: request moving through stages with status changes

### Interaction
- [ ] **P2 — End-to-end flow recording**: employee submits → manager approves → confirmation. One take, real speed, shows it actually works
- [ ] **P3 — Error/edge-state moments**: what happens when a request bounces

### 3D
- Skip.

---

## 6. Patreon Discovery

### Motion
- [ ] **P1 — Tile loop** (`assets/tiles/patreon-sage.mp4`, 4:3): Sage conversation — query typed, recommendations cascading in. Conversational AI loops beautifully
- [ ] **P2 — Discovery graph animation**: "creators you support" branching out to "creators you'd love" — the recommendation logic made visible
- [ ] **P3 — Sage personality micro-motions**: thinking state, suggestion shuffle

### Interaction
- [ ] **P2 — Full Sage session recording**: a realistic discovery journey from prompt to following a new creator
- [ ] **P3 — Comparison recording**: current Patreon discovery vs. yours, same goal, timed

### 3D
- Skip.

---

## Playground (bonus — placeholders already exist on the page)

- [ ] **P2 — One-Button Sound** (Unity): screen capture of the build, 1:1 or 4:5 loop
- [ ] **P2 — Newton's Pendulum** (Blender): rendered loop, 1:1 — pendulums are born to loop
- [ ] **P3 — Fill remaining placeholder cards** or delete them; empty "Project Title" cards read as unfinished

---

## Tile specs (homepage grid)

- Format: MP4 (H.264), no audio, `autoplay muted loop playsinline`
- Length: 8–20 seconds, seamless loop (end where you start)
- Width: 1600px max, under ~8MB (Handbrake to compress)
- Shapes: Airline + Airbnb tiles are 21:9 (wide), the rest 4:3
- Drop files in `assets/tiles/` — each placeholder in `index.html` has a comment above it showing the exact one-line swap

## Suggested order of attack

1. Airline tile loop (lead tile, currently placeholder)
2. WorkTrip + Patreon tile loops (kill the remaining placeholders)
3. COROS watch render in Blender (doubles as portfolio proof of your 3D skills)
4. Solace misalignment animation (hardest story to tell, biggest payoff)
5. Everything P2 in case studies, then playground

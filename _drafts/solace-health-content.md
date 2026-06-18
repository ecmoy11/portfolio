# Solace Health — Case Study Content Draft

## Header

**Title:** Solace Health
**Subtitle:** Designing the collaboration system, not just the interface
**Role:** Framework Design Lead
**Team:** Emma Moystner, Christina Lee, Roxanna Jackson, Shruti Amritkar
**Duration:** One term — Spring 2026
**Course:** GIXD 609 · People, Processes, Leadership
**Program:** ArtCenter College of Design, M.Des Interaction Design
**Tags:** Systems Design · EPD Collaboration · Service Design

---

## Overview

Solace Health is a women's healthcare startup based in Austin, delivering personalized primary care through a mobile-first clinic network. After securing Series B funding, they're scaling fast — expanding across five cities nationwide.

But growth exposed a structural problem: every city has different regulations, demographics, and clinical needs, and Austin's core team was making product decisions in isolation. The result was sprint rework, delayed launches, and local teams who felt like they were building someone else's product.

Our team of four was tasked with designing a new collaboration workflow — from pre-project kickoff to final delivery — along with rituals and tooling to help Solace Health's EPD teams collaborate more effectively across cities.

I led the framework design: the structural layer that makes misalignment visible before it compounds into delays, rework, and launches that miss their market.

---

## The Problem

Six months before a new-city launch, three critical breakdowns were already in motion:

**The PM drafts in isolation.** Daniel, the Austin PM, creates roadmaps and requirements without cross-city input. By the time local teams see them, the assumptions are baked in.

**Engineering hits blockers mid-sprint.** Maria, the Engineering Lead, discovers architectural conflicts — like an EHR integration that doesn't work in the new city's regulatory context — triggering weeks of rework.

**Design discovers requirements too late.** Teri, the Design Lead, finds city-specific clinical and demographic requirements after designs are already approved, forcing redesigns from near-final work.

The impact: launch delays of 6–8 months per city. With 15 new team members and growing, that's a minimum of $1.5 million in wasted labor on rework alone — before accounting for deferred revenue lost during delays.

---

## Research

We surveyed and interviewed 13 engineers, product managers, and designers across companies including Meta, Netflix, TikTok, Indeed, Walmart, and SAP. We ran a synthesis workshop to map patterns, surface tensions, and prioritize what mattered most.

### What we heard

**Alignment is the unlock — but it's never handed to you.** Across every interview, surfacing assumptions early was the single biggest factor in whether EPD teams succeeded or struggled. As one participant put it: "When feasibility, direction, and customer value are answered early, all three disciplines are energized." But the norm was the opposite — business priorities shift constantly, clarity is never spoon-fed, and alignment has to be forged collectively.

**Everyone is drowning in communication, but starving for context.** Teams described being buried in Slack messages, emails, and back-to-back meetings while still lacking visibility into what other disciplines were actually doing. "EVERYONE is being asked to do more with less people, and still spends a bulk of their time in communication channels to get aligned." Information overload was constant — and it scaled with role and org size.

**Decisions happen without the people closest to the problem.** PMs described not being true decision-makers — "they just hop from one call to another and don't push back on business requirements." Engineers flagged friction from leaders who didn't know how to enter new markets. Designers felt their input came too late, after assumptions were already baked in. Seniority often trumped impact in decision-making, even when it didn't align with reality.

**Culture is built through small, deliberate gestures.** A cameras-on policy transformed engagement overnight. One person doing a daily icebreaker made their standup dramatically better than the other. Named teams — like "The Custodians" for tech debt — created identity and pride. These weren't perks; they were infrastructure for trust.

**The tools aren't the problem — the gaps between them are.** Teams used Jira, Slack, Notion, and more, but no tool bridged the space between disciplines. There was no shared source of truth that evolved with the project, forcing teams to rely on meetings and tribal knowledge to stay aligned — which broke down across time zones, seniority gaps, and shifting requirements.

### The synthesis

We mapped these findings into an affinity diagram and identified core tensions: speed vs. craft, vision vs. feasibility, strategy vs. execution, autonomy vs. alignment. The pain points clustered around poor communication, bad collaboration, too many meetings, time zone friction, resource allocation, and structural/cultural misalignment. From these, we identified opportunity areas in decision-making clarity, collaboration acceleration, feedback loops, and culture-building — which directly shaped our three-part solution.

---

## Objectives

We defined four objectives that would guide our design:

1. **Protect sprint efficiency** — Tooling that maintains velocity across simultaneous city launches
2. **Eliminate decision ambiguity** — Frameworks that make it clear who owns what, and what's been decided
3. **Scale institutional knowledge** — Every city learns from the last, not just the first
4. **Build two-way decision culture** — Local teams flag issues early and shape the decisions that affect them

---

## The Design: A Three-Part System

The solution isn't a single artifact — it's a system. Three interconnected layers, each reinforcing the others:

### 1. The Ritual — Pre-Kickoff Alignment Call

A structured 60-minute call that happens before every city launch. The agenda goes out in advance. The flow is deliberate:

- **Local learnings first.** The new city's PM presents first — local context, clinical constraints, demographic insights. Austin listens before it leads.
- **Clinic and community shares.** Local clinicians share what Product should have on their radar.
- **Post-retro Q&A.** Open discussion grounded in real learnings.
- **Handoff moment.** One named decision is handed off, documented, and witnessed by the full room.

The design move: putting the local PM first isn't just polite — it's psychological safety by design. When people feel heard, they commit harder to what comes next.

A weekly async ritual — the **City Pulse Check** — keeps alignment alive between calls. Every city team reports what's in progress, what's blocked, and what needs escalation. By Friday, the Austin PM has a full picture across every city without chasing anyone down.

### 2. The Framework — Launch Readiness Canvas + Decision Context Log

The **Launch Readiness Canvas** gets filled out during weekly calls. PMs are responsible for making sure the team completes it before the alignment call. Every section has a named owner:

- **Decision Readiness** — where operational decisions get logged. Daniel owns it and ensures every item has a decision or an owner.
- **Local Adaptation** — captures what the new city is changing from the Austin playbook, with evidence attached. Mark owns the adaptations; Teri owns the evidence.

The **Decision Context Log** is the digital artifact that persists across launches. Maria transfers knowledge from the canvas to the log. The next city inherits it. It's required reading before any new PRD.

Teams can search and filter the log to find relevant context for what they're currently working on. This is how institutional knowledge actually scales — not through tribal knowledge or onboarding docs that no one reads, but through a living artifact tied to real decisions.

### 3. The Tool — Sprint Ticket Panel

With rituals and frameworks set, we saw a clear pattern: the disconnect between team members wasn't just happening within tools, but between them. Teams already use Jira, Slack, and Notion — each serving a purpose, but none bridging the gaps.

Instead of building another standalone product, we designed a lightweight plugin — the **Sprint Ticket Panel** — that connects across these existing tools:

- **In Slack:** The panel integrates directly into the workspace, generating dedicated channels for each Jira ticket
- **In Jira:** A side panel provides deeper sprint visibility — active blockers, team health, sprint velocity
- **City Pulse Check view:** Shows what's in progress, blocked, or needs escalation across cities
- **AI Health Summary:** A quick overview of sprint status with suggested actions — like sending an async message or scheduling an alignment call

---

## How the System Works

Here's a real scenario showing the system in action:

Teri is a designer on the Chicago expansion. Early in sprint, she catches something — the product carries an assumption that doesn't hold in this market.

Under the old way, that flag gets buried. The sprint ships. The wrong assumption goes with it.

But here's what happens instead:

1. **Teri flags it right where she's working** — no extra step, no chasing anyone down.
2. **Her flag surfaces in the weekly async.** The right people see it. If it needs a decision, it routes to the alignment call.
3. **The decision lands in the Decision Context Log.** It's documented, not lost. Teri can see what happened to her flag without asking.
4. **The log feeds the retro.** The learnings shape the next cycle.

That's the point. Not to eliminate the hard decisions, but to catch misalignment early — before it compounds into delays, rework, and launches that miss the market.

---

## Testing & Iteration

We conducted two rounds of usability testing with EPD professionals:

**Round 1 findings:**
- Isolated signal labels didn't communicate meaning clearly
- AI recommendations felt coercive and forced
- Time zone and availability issues weren't considered in automated scheduling
- Auto-scheduling was universally rejected

**Round 2 refinements:**
- Moved AI Health Summary into the Sprint Ticket Panel instead of a dedicated popup
- Provided users with two recommendation options instead of one — giving them agency
- Consolidated the interface and removed unnecessary elements
- Added dark mode support

The most telling finding: people didn't reject AI assistance — they rejected AI that didn't give them a reason to trust it. The system needs to support decisions, not make them. Agency isn't a feature; it's the prerequisite.

---

## Measuring Success

We measured success across three signals:

**Speed** — Are teams maintaining momentum while reducing costs as new cities scale? Fewer sprint disruptions, shorter rework cycles, faster time-to-launch.

**Credibility** — Are decisions documented with owners and context? Is product knowledge accumulating rather than evaporating? This builds competitive advantage through institutional memory.

**Belonging** — Are local teams saying "we" instead of "they"? Are they shaping decisions, not just executing them? This is the hardest to measure and the most important. Strengthening relationships and empowering teams to be co-authors of the product.

---

## Reflection

This project changed how I think about what designers can — and should — design.

Working at the systems level meant designing rituals, decision flows, and knowledge structures instead of screens. The core insight: **psychological safety isn't just a value to aspire to — it's designable.** The Pre-Kickoff Alignment Call puts the local PM first so Austin listens before it leads. The City Pulse Check makes flags visible without requiring someone to interrupt a meeting. The Decision Context Log means a designer can see what happened to her flag without asking. These are psychological safety mechanisms, not just principles.

Team culture isn't a soft problem separate from the "real" design work. It *is* the design work. How people collaborate — who speaks first, who owns what, where knowledge lives — determines whether the product succeeds more than any interface decision.

The usability testing reinforced this in an unexpected way. People didn't reject AI assistance. They rejected AI that decided for them. You can design the conditions for trust, but you can't automate trust itself. Agency is the prerequisite — for tools, for teams, for the whole system.

If I did this again, I'd push further on customizable stakeholder selections and invest more in onboarding — making the system easier to adopt for teams who haven't experienced the collaboration pain yet. The hardest sell isn't the framework itself; it's convincing teams who think their current process is "fine" that invisible misalignment is already costing them.

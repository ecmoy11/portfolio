# COROS — Case Study Draft

*Emma, proofread this and mark up anything that's wrong, missing, or doesn't sound like you. Pulled from your Service Design presentation + speaker notes.*

---

## Tagline

**COROS built a menstrual cycle tracker. It's just a calendar. Women athletes deserve a system that actually connects their cycle to their training.**

---

## Meta

- **Role:** Service Designer & Researcher
- **Duration:** One Term — Fall 2025
- **Course:** Product, Services, Systems
- **Solo project**

---

## Overview

I use COROS every day. When they launched menstrual cycle tracking, I turned it on immediately. And honestly? It was a bust. What should be a feature that builds trust and loyalty is instead eroding both. The tracker is a basic period calendar with a 10-day ovulation window (which, if you know anything about women's physiology, is way off), no phase insights, and nothing connecting the data to training. This project audits the full service — frontstage and backstage — and redesigns COROS's menstrual cycle tracking from a passive calendar into a phase-aware training intelligence system.

---

## The User's Experience Today

Meet Caia. She's a 32-year-old trail runner training for a 25K with over 3,000 feet of elevation gain. She came to COROS because they're best-in-class for GPS and running metrics. As a woman, she got excited when she saw menstrual cycle tracking — finally, phase-aware training guidance. Instead, she found a basic period calendar. The ovulation window stretched to 10 days. No phase insights. Nothing connecting the data to her training. Caia disengaged. So did I.

The experience map captures that journey: Caia enables the feature with uncertainty (no onboarding, no context), views a calendar with minimal information, logs her period, notices the predictions don't match her lived experience, submits feedback, and eventually abandons the feature entirely. The emotion arc tells the story: uncertain, confused, unsure, frustrated, disappointed, abandoned.

This is a feature that should build trust and loyalty. Instead, it's eroding both.

---

## Current State Audit

**UI Audit.** The menstrual cycle card is buried at the bottom of the Today screen. The information is minimal. When you tap in, you see data that's often incorrect — like that 10-day ovulation window. There's no education, no context, no connection to training. Low contrast and small text compound the accessibility problems.

**Service Blueprint — Current.** This was the hardest part. I'm not inside COROS. I don't know their actual tech stack or team structure. So I focused on functional categories — what roles and systems would need to exist to make this work. What I found is a system that's reactive, not proactive. The backstage is doing basic date math for predictions. When Caia notices inaccuracies, feedback gets categorized but doesn't close the loop. The CRM sends generic nudges that have nothing to do with her cycle. There's no intelligence connecting her data to actual value.

**Competitive Analysis.** I analyzed five major players: COROS, Garmin, WHOOP, Oura, and Fitbit. COROS has strong recovery intelligence and training load integration — that's their core strength. But they're missing what WHOOP and Oura do well: turning physiological data into daily coaching. The opportunity: leverage COROS's existing training load and HRV data to provide phase-aware training guidance that none of their competitors currently offer for serious runners.

---

## The Redesign

### Service Blueprint — Ideal

The ideal blueprint changes everything. An adaptive ML model fusing HRV, sleep, strain, and period history replaces static date math. A real-time event pipeline updates predictions instantly when she logs. An insight engine generates daily training cues. A notification engine delivers personalized nudges. And a training-load integration layer syncs her cycle to her weekly planner.

The backstage is working for her now, not just storing her data.

### Onboarding — Education First

I focused on onboarding because this is the first point where trust is built or broken. Menstrual cycles are personal. They're variable. And most apps treat them like a simple math problem. I designed an introduction that educates first. The screens explain the four phases — Menstrual, Follicular, Ovulation, Luteal — with hormone curves, set realistic expectations about prediction accuracy, and help Caia understand why this feature will make her a better athlete.

Each phase card shows actionable guidance across four dimensions: sleep efficiency, strain tolerance, stress tolerance, mood, training recommendations, and fueling advice. During Follicular phase: "Rising energy and focus. A good window for challenges. Great time for hard efforts. Your body is ready to build." During Luteal: "Emotions may feel heightened. Be gentle with yourself. Steady efforts work best. Prioritize consistency over intensity."

The goal is that when she finishes onboarding, she thinks: "This app gets it. This app gets me."

### Redesigned Today Dashboard

The Phase Insights card moves from the bottom of the screen to a prominent position in the Today view, showing current phase (e.g., "Ovulatory Phase"), cycle day, a confidence indicator, and tolerance chips for sleep, strain, and stress. The cycle is no longer buried — it's integrated into how she sees her day.

### Watch Face

I also designed watch face complications showing cycle day, current phase, and days until next period — bringing phase awareness to the wrist where athletes actually look during training.

---

## Ideal Experience

The north star flips the emotion arc completely. Caia onboards with education — she understands why this matters for her training. She views her phase with a confidence score, so she knows how much to trust the prediction. She logs symptoms and sees instant feedback. She receives daily personalized cues — training recommendations, recovery guidance, fueling suggestions. She plans her hard efforts around her physiology. And over time, she sees trends that prove the system works.

Hopeful → Trusting → Engaged → Empowered → Confident → Loyal.

---

## Accessibility Considerations

I conducted an accessibility audit of the design covering six areas: visual accessibility (pattern/texture differentiation alongside color coding for phase indicators), text size and contrast (4.5:1 minimum ratio, dynamic text sizing), cognitive load (progressive disclosure rather than front-loading all four phases), screen reader support (semantic labels like "Ovulatory Phase, Day 14, High confidence"), motor accessibility (minimum 44x44px touch targets per WCAG), and inclusive language (plain language defaults with optional "learn more" for technical details).

---

## Reflection

This project pushed me. Service design for a fitness watch app isn't intuitive — when I think of service design, I think of hotels and restaurants where you can see the frontstage and imagine the backstage. But a software product? Thinking about backstage systems when I can't see behind the curtain was uncomfortable. But that discomfort is where I grew the most. Mapping the ecosystem — from PM decisions to data pipelines to CS retention scripts — forced me to think about design as a system, not a screen.

---

*Resolved:*
- *Fall 2025, Product Services Systems ✓*
- *Presented to the class ✓*
- *Earlier menstrual cycle project = backstory for this case study (not separate) ✓*
- *Images already extracted from deck ✓*

*Still needed:*
- *A/B testing note — Emma wants to add this*
- *Before/after comparison (what COROS shipped vs. your design)?*
- *Recreate competitive analysis table as HTML? (deck image is small)*
- *Survey data from Menstrual Cycle Features Survey?*

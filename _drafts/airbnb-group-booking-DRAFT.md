# Airbnb Group Booking — Case Study Draft

*Emma, proofread this and mark up anything that's wrong, missing, or doesn't sound like you. Updated with content from your portfolio deck.*

---

## Tagline

**Group trips shouldn't fall apart before they start. We redesigned how Airbnb handles the hardest part — the money.**

---

## Meta

- **Role:** Product Designer
- **Team:** Emma Moystner, Kate Foote
- **Duration:** 4 weeks, 2024
- **Context:** Memorisely Bootcamp Project
- **Type:** Concept redesign

---

## Overview

Airbnb's lack of streamlined group booking puts the entire financial and logistical burden on one person, making trip planning and payments harder for everyone involved. We were tasked with redesigning Airbnb's booking process to facilitate seamless group reservations — enabling travelers to split costs, coordinate decisions, and book together without relying on spreadsheets and Venmo.

We redesigned the group booking experience from research through high-fidelity prototype, introducing shared trip planning, flexible cost-splitting, and a centralized group hub that gives every traveler visibility and agency — not just the person holding the credit card.

---

## Design Goals

To ensure the solution meets the needs of real users, we focused on three core objectives:

1. **Simplify the group decision-making process** — reduce the coordination overhead that makes group trips exhausting before they even start
2. **Make cost-sharing transparent and flexible** — accommodate different group dynamics, from even splits to custom contributions
3. **Seamlessly integrate group features without disrupting existing user flows** — the group experience should feel native to Airbnb, not bolted on

---

## Research

We designed and distributed a structured survey with open-ended questions to gather insights on how people currently navigate group bookings. The goal was to understand not just the functional pain points, but the social and emotional friction — the conversations people dread, the roles they get stuck in, the moments where the experience breaks down.

Three findings anchored the project:

**82% of respondents wanted to split costs "fairly"** — but "fairly" meant different things to different groups. Some wanted even splits. Others wanted to pay proportionally based on room size, number of guests, or arrival dates. The current system supports none of this.

**63% wanted payment reminders** — not because they're forgetful, but because asking friends for money is uncomfortable. People wanted the platform to handle the follow-up so they didn't have to.

**71% wanted to share the planning workload** — the organizer role is exhausting. Researching listings, coordinating dates, collecting preferences, managing the budget. Respondents wanted tools that distributed this work across the group.

Three research themes emerged:

**Integrated Payment Solutions.** Simplifying the payment process directly within Airbnb minimizes reliance on third-party apps, making group payments smoother and more secure.

**Flexible Cost-Splitting Options.** Allowing users to split costs evenly, by specific amounts, or by room selection provides essential flexibility to accommodate varying group needs.

**Streamlined Group Management.** Reducing the time and effort required to organize group trips keeps planning simple and stress-free for all participants.

---

## Design Process & Key Decisions

The research pointed to three design directions: payment flexibility, shared planning, and group transparency. We designed a system of interconnected features rather than isolated additions to Airbnb's existing flow.

**Easy Group Trip Toggle.** A simple toggle at search to create a group trip — no separate flow, no buried settings. Group booking starts where every booking starts.

**Group Trip Onboarding.** When invited to a group trip, members see an intro page that collects payment information upfront. This ensures a quick process later and prevents the checkout bottleneck where one person is waiting on everyone else.

**Budget-Aware Search.** The total group budget automatically disqualifies properties that exceed what the group can afford. Search results only show what's actually within reach — no aspirational browsing that leads to disappointment.

**Splitting Method.** We designed three cost-splitting modes — EvenSplit, FairValue, and PayManage — so groups can choose the model that matches their dynamic. An even split for close friends going halves. FairValue for proportional splits based on room or group size. PayManage for custom contribution amounts. Pop-up information ensures clarity over payment selections for both admins and guests.

**Group Trip Hub.** A centralized space where the group can save listings to a shared wishlist, vote on favorites, and track the trip from planning through booking. The hub shows who's in the group (with roles — co-admin vs. guest), individual budgets, the selected splitting method, and an approvals queue. Approvals are required to book — no one person can commit the group without consensus.

**In-App Messaging.** Rather than forcing coordination into iMessage or WhatsApp, we built group messaging directly into the trip flow. Notification categories — Traveling, Direct Msg, Reserved Space — keep the signal-to-noise ratio manageable. The messaging isn't a general chat app; it's scoped to the trip.

**Confirm & Pay.** The checkout screen shows a simple payment breakdown with built-in reminders, ensuring transparency over trip expenses. Each member sees their contribution, the splitting method, property details, and cancellation policy — so everyone can confirm and pay from their own account.

---

## Key Screens

1. **Group Listing View** — Portugal 2024 trip showing Casa Mú (Eco-friendly 5 bedroom Luxury Villa in Lagos), $2,360 total, with group member approval status
2. **Splitting Method** — EvenSplit selected, showing 5 group members with individual contribution breakdowns ($405–$486 each), with splitting method functionality providing exact control over amounts due
3. **Group Trip Wishlist** — Onboarding flow for a new group trip: add itineraries, write notes, vote on favorites, manage payments
4. **Messages** — Trip-scoped group messaging with notification filtering
5. **Trip Details** — Group management hub: 6 adults + 1 child, individual budgets ($600–$1,300), co-admin roles, total budget $4,200
6. **Confirm and Pay** — Final checkout with property details, EvenSplit contributions ($485.83 each), free cancellation policy

---

## Validation

Usability testing revealed both wins and areas for refinement:

**Seamless Group Onboarding.** Integrating the group feature into the wishlist flow made it intuitive for users to invite others, enhancing planning without disruption. Users naturally understood how to start a group trip.

**Clarity Drives Confidence.** EvenSplit and FairValue were well-received for their simplicity and thoughtfulness. In contrast, PayManage caused hesitation due to confusion about payment visibility — users weren't sure who could see what. This pointed to a need for clearer affordances around privacy and transparency in the managed payment flow.

**Feedback & Visibility Matter.** Users missed key elements like the comments section and expected notifications for group actions, highlighting the need for clearer UI cues and better communication tools. When someone joins, approves, or pays — the group should know.

---

## Reflection

[Emma — optional reflection still open. Could touch on: hardest design decision, what you'd do differently with PayManage, how your approach has evolved since starting ArtCenter.]

---

*Resolved:*
- *Kate led research, Emma led design ✓*
- *Prototyped in Figma ✓*
- *Images collected (wireframes + hi-fi screens in images/airbnb/) ✓*

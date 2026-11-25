---
title: "AI Morning Briefing: Wednesday 25 November 2026"
date: "2026-11-25"
description: "A quiet window: OpenAI reports lab-tested protein designs from its GPT-6 models, an OpenAI case study on amateur exoplanet searches, and Databricks guidance on data modelling for an agentic customer data platform."
tags:
  - AI
  - Data Platforms
  - Financial Services
---

**Window covered:** Tuesday 24 November 2026, 07:30 CET to Wednesday 25 November 2026, 07:30 CET.

**Headline:** A light news day. The most substantive primary-source item is OpenAI's account of lab-tested protein designs from its GPT-6 models, which is mainly a signal about general-purpose models doing specialist work. Little of direct financial-services or regulatory relevance was published in the window; the UK FCA's agentic-AI statement was covered in the previous briefing.

---

## Generative AI and foundation models

### OpenAI: GPT-6 models show "intrinsic" protein-design ability, with early lab evidence — 24 Nov 2026 — [OpenAI](https://openai.com/index/gpt-6-models-demonstrate-intrinsic-protein-design-capabilities)

**What happened:** OpenAI published a research post and preprint saying its GPT-6 family can design protein shapes and sequences using only reasoning and general-purpose code, without calling specialised biology models for the design step. An internal research model matched or beat specialised models on many of 14 computational protein tasks. In lab tests with the partner Onava, 322 small binding proteins based on GPT-6.2 designs were tested against five targets, and 35 (10.9%) showed evidence of binding, with at least one hit per target. Redesigned antibody fragments also largely kept binding.

**What is and is not established (per OpenAI's own limitations section):** Specialised models were still used to suggest amino-acid sequences and to filter candidates, so the results do not show end-to-end design without them. Predicting a full protein structure from a sequence remained well behind specialised models. OpenAI also cautions that some benchmark scores may partly reflect memorisation. Binding is one step only; specificity, stability, biological activity and safety are untested. OpenAI notes the original RFdiffusion study reported higher hit rates, though definitions and filtering differ. The post does not describe general availability of the research model.

**Why it matters:** The pattern is a general model replacing a pipeline of narrow tools, steered by plain-language instructions. For data and architecture teams, the same question applies to internal workflows: when does one general model plus code execution replace several bespoke models, and what remains in the pipeline as a filter or check?

**Implications:** Evaluation design matters more than headline scores. OpenAI's own caveats (specialised filters, memorisation risk, uneven capability) are a useful template for how to read any vendor claim of "matches specialist models".

---

## AI agents and applications

### OpenAI: amateur astronomers use Codex and Astra to flag possible exoplanet candidates — 24 Nov 2026 — [OpenAI](https://openai.com/index/searching-for-distant-planets-with-astra)

**What happened:** OpenAI describes two amateur astronomers who used Codex and a tool called Astra to search public telescope data for small, repeated dips in starlight. They passed a few candidate locations to professional astronomers for closer follow-up. These are leads, not confirmed planets, and the post is a vendor case study rather than peer-reviewed work.

**Why it matters:** It shows agentic coding tools being used by non-specialists to run their own analyses on public datasets. The same shift applies to analytics teams: more people can build ad hoc analyses, which raises the importance of governed data access and review of results before they are acted on.

---

## Infrastructure and data platforms

### Databricks: data modelling guidance for an "agentic" customer data platform (Part 1) — 24 Nov 2026 — [Databricks](https://www.databricks.com/blog/agentic-cdp-data-modeling-data-foundation)

**What happened:** Databricks published the first part of a vendor guide on modelling data for a customer data platform built on its lakehouse. The outline covers owning the identity graph, modelling the gold layer as entity, attribute and behaviour tables, omnichannel activation with a feedback loop, and a data-foundation checklist. Part 2 is announced but not yet published. It is a vendor blog with product positioning, not independent evidence.

**Why it matters:** For financial-services marketing and client analytics, the useful part is the architectural pattern: identity resolution and a clean entity layer come before any agent-driven activation. Consent, purpose limitation and lineage need to be designed in at that layer, particularly under GDPR and Swiss data-protection rules.

---

## Other notable updates

- [Google: Gemini at the Golden State Warriors](https://blog.google/products-and-platforms/products/gemini/gemini-golden-state/) — 24 Nov 2026. A marketing-style customer story with little technical content.

---

## Overall take

1. **General models are absorbing specialist workflows.** OpenAI's protein result is promising but, by its own account, still depends on specialised filters. Treat "matches specialist models" claims as task-specific.
2. **Non-specialists are running their own analyses with agents.** The bottleneck moves from building analyses to governing data access and verifying results.
3. **Data foundations come first.** Vendor guidance on agentic platforms keeps returning to identity, entity modelling and feedback loops before the agent layer.

The main trend: capability stories are increasingly about workflow replacement, and the practical controls (evaluation, filtering, governed data) matter more than the headline model.

---

## Daily learning skill: reading a hit rate honestly

**The concept:** A hit rate such as "35 of 322 designs bound their target (10.9%)" is only comparable to another hit rate if both used the same filtering and the same definition of a hit. Pre-filtering candidates with a strong model raises the rate. A looser definition of success raises it too. Always ask: what was selected before testing, and what counts as a success?

**Example (financial services):** A fraud model flags 1,000 transactions and 109 are confirmed as fraud, a 10.9% precision. If a vendor's model reports 40% precision but only on transactions that rules had already pre-screened as high risk, the two numbers cannot be compared. The fair comparison runs both on the same unfiltered population.

**2 to 5 minute exercise:** Take one precision, hit-rate or accuracy figure from a vendor deck or paper you have seen recently. Write down three things: the population tested, any filtering applied before testing, and the definition of success. If any of the three is missing from the source, note that the number cannot yet be compared with your own results.

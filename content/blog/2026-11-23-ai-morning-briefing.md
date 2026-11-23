---
title: "AI Morning Briefing: Monday 23 November 2026"
date: "2026-11-23"
description: "Quiet weekend after a big week: Anthropic's IPO closes at about $93.5B, OpenAI details defences against distillation, Databricks Genie ZeroOps and Gemini computer use on Mac land, and EU AI Act labelling rules loom on 2 December."
tags:
  - AI
  - Data Platforms
  - Financial Services
---

**Window covered:** Friday 20 November 07:30 to Monday 23 November 07:30 (Europe/Zurich), including the weekend.

**Headline:** A quiet weekend. Two primary-source items fall inside the window (Anthropic's IPO closing and OpenAI's distillation post). The rest of the material below was published on 17 to 19 November and is flagged as "just before the window" where it matters for planning.

---

## Generative AI and foundation models

### Anthropic closes its IPO at about $93.5B gross, plus a $26B private placement — 20 Nov 2026 — [Anthropic](https://www.anthropic.com/news/ipo-close)

**What happened:** Anthropic announced the closing of its IPO: 1.127 billion Class A shares at $83.00, including the full greenshoe, for about $93.5B gross (about $91.6B to the company). Trading on Nasdaq (ticker ANT) began on 19 November. A concurrent private placement of Class N shares to AMD, Broadcom, Google, Micron, Microsoft, NVIDIA and TSMC Partners raised about $26.0B at the same price. Total gross proceeds were about $119.5B.

**Market reaction (secondary reporting, not verified against exchange data):** One digest reports the stock opened down more than 9% on 20 November in a broad risk-off session. Weekly roundups disagree on the base deal size ($81.3B before the greenshoe), so treat market figures with caution. Only the company's own numbers above are confirmed.

**Why it matters:** Claude's vendor now reports publicly, so margins, compute commitments and pricing pressure should become visible quarterly. The chip and cloud suppliers that bought into the placement are also major infrastructure partners, which ties compute supply and model supply more closely.

**Implications:** For vendor-risk files at financial institutions, a listed model supplier brings public disclosure and more predictable governance, but also quarterly earnings pressure. Contract clauses that referenced the offering now have a fixed date.

### Just before the window: new flagship models from OpenAI and Google — 17 to 18 Nov 2026 — [OpenAI](https://openai.com/index/combatting-adversarial-distillation) (names GPT-6.2 Astra and Sol)

**What happened:** OpenAI's 20 November post refers to GPT-6.2 Astra and GPT-6.2 Sol as current models. Trackers date their release to 17 November, with Google's Gemini 4 Neon on 18 November. I did not confirm prices, benchmarks or availability from primary release notes, and the model names and prices appear only in aggregator pages. **Treat model details as unverified until checked against the vendors' own notes.**

---

## Governance, security, privacy and regulation

### OpenAI explains how it detects and blocks adversarial distillation — 20 Nov 2026 — [OpenAI](https://openai.com/index/combatting-adversarial-distillation)

**What happened:** OpenAI published how it defends against adversarial distillation: using a model's outputs without authorisation to train a rival model that lacks equivalent safeguards. The defences combine adversarial testing, model training, classifiers, API-level protections and investigations of coordinated campaigns. The focus is "protected reasoning" (the intermediate chain-of-thought). In an internal adaptive evaluation, the attack success rate for recovering protected reasoning fell from 54.0% against GPT-6 Astra to 0.2% against GPT-6.2 Astra. That is OpenAI's own measurement, not independently verified. An earlier post, dated 30 September 2026, described a specific campaign: 16,000 extraction-pattern requests from over 4,000 users on 24 and 25 July, and a related cluster of more than 15,000 users disrupted by 28 July.

**Why it matters:** Distillation is both an IP issue and a safety issue. If a model's behaviour can be copied without its safeguards, cyber and other misuse capabilities spread.

**Implications:** Expect stricter API terms, rate limits and monitoring from frontier vendors. Enterprises that fine-tune or distil from vendor outputs should read the terms on using outputs to train other models. Some vendors will hide or summarise reasoning traces, which affects explainability and audit approaches that rely on them.

### EU AI Act: labelling and marking deadline of 2 December 2026 is close — background — [European Commission](https://digital-strategy.ec.europa.eu/policies/guidelines-transparency-ai-generated-content)

**What happened (background, not new this weekend):** The Digital Omnibus on AI (Regulation (EU) 2026/1744, in force since 27 July 2026 per the sources found) delays high-risk obligations and sets 2 December 2026 as the date by which AI systems already on the market must meet Article 50(2) marking and detection duties, according to the Commission's press release. Commission Article 50 guidelines and a voluntary Code of Practice on Transparency of AI-Generated Content are published. One law-firm note mentions a later date of 2 February 2027 for watermark-detection interoperability, and I could not reconcile the two dates. Two new prohibitions (non-consensual intimate deepfakes and AI-generated child sexual abuse material) are reported to start on 2 December 2026, per secondary sources.

**Why it matters:** Roughly nine days remain. Any bank or insurer deploying generative systems that produce synthetic images, audio, video or public-interest text should know whether it is a provider or deployer, and what marking applies.

**Implications:** Check the official Commission pages for the exact obligations per role before relying on the secondary summaries above.

---

## AI agents and applications

### Databricks Genie ZeroOps in public beta — 19 Nov 2026, just before the window — [Databricks blog](https://www.databricks.com/blog/introducing-genie-zeroops), [docs](https://docs.databricks.com/aws/en/zeroops/)

**What happened:** Databricks announced Genie ZeroOps on 16 June 2026 as a background agent that monitors pipelines, jobs, tables and ML models, investigates problems and proposes fixes. Secondary reporting (Unite.ai) dates the public beta to 19 November. Docs call it Beta, require a workspace admin to enable it, and state that it is not HIPAA compliant, needs separately billed data-quality monitoring, and runs on Anthropic models on Databricks-hosted endpoints. Reported features: shared inboxes, per-issue notifications, custom instructions, one-click pull requests for Git-backed jobs. The 80,000-issues-in-preview figure is from a secondary source.

**Why it matters:** This is the clearest example of agents moving into data operations: failure triage and fixes for pipelines. Proposed fixes need human approval before reaching production.

**Implications:** Check cost (DBUs plus monitoring), data residency of model endpoints, audit logging of agent proposals, and whether pull-request automation fits your change-control process. Beta status means no production SLAs.

### Gemini app for Mac gets background "computer use" — 19 Nov 2026, just before the window — [Google](https://blog.google/innovation-and-ai/products/gemini-app/computer-use-mac/)

**What happened:** Google began rolling out computer use in the Gemini app for Mac: Gemini can click, type and fill in forms across local apps and websites from an "@Computer use" prompt. **Available now:** English, US only, Apple Silicon with macOS 15 or newer, personal accounts aged 18+, Google AI Plus, Pro or Ultra plans. Reported controls (secondary reporting): per-app access, visible steps, ability to stop, and approval for sensitive actions. No benchmarks or success rates were published.

**Why it matters:** Desktop agents are arriving as consumer features before enterprise controls catch up.

**Implications:** Bank and asset-manager security teams should decide now whether personal-account AI agents with file and app access are allowed on managed Macs.

### OpenAI: agents finish 46% of 2-to-4-hour research tasks — 18 Nov 2026, just before the window — [OpenAI](https://openai.com/index/research-acceleration-view-inside-openai/)

**What happened:** In its "Research acceleration: The jagged frontier" post, OpenAI reports that its agents completed about 46% of internal research tasks estimated at two to four hours of human work, up from 23% in March, and 35% (from 13%) for four-to-eight-hour tasks. Success is uneven: reported at 79% for monitoring training runs but 25% for writing serving code. These are OpenAI's internal estimates, and the task mix may have shifted over time (details from secondary coverage; check the original).

**Why it matters and implications:** A useful reference for sizing agent work: bounded, monitored tasks first, with approval gates, and measure completion separately from the cost of fixing mistakes.

### Microsoft Ignite: agent identity and control — 17 to 20 Nov 2026, just before the window — [Microsoft Tech Community](https://techcommunity.microsoft.com/blog/agent-365-blog/whats-new-in-microsoft-agent-365-ignite-2026/4571753)

**What happened:** Microsoft's Agent 365 blog describes Entra identities for agents from several vendors, discovery of local agents such as Claude Code and GitHub Copilot CLI, and a combined agent risk view across admin, Defender, Entra and Purview. Most of this is preview per Microsoft's text; one secondary summary claims GA, which conflicts. Pricing was not found.

**Why it matters:** Giving each agent its own identity, rather than a shared service account, is what makes audit and least-privilege possible.

---

## Other notable updates

- A research release dated 23 November reports that nearly half of supervisory rules in multi-agent runs lived only in prompts, and that executable acceptance checks caught failures prompts missed (single secondary summary: [AI Agent Store](https://aiagentstore.ai/ai-agent-news/this-week); not verified against the paper).
- Apple is reported (job listing, 21 November) to be hiring for a general computer-use agent. No product announced ([AI Agent Store](https://aiagentstore.ai/ai-agent-news/this-week)).
- Several trackers mention a Thinking Machines "Inkling 2 Mini" on 20 November. I found no confirmation. Inkling 2 Small (5 November) is the only second-generation model I could verify.
- A Bell Canada incident described as involving an "agentic" attacker appears in one aggregator. I found no corroboration, so it is excluded.

---

## Overall take

1. **Anthropic's IPO close** makes a frontier model vendor a public company with disclosed numbers, and links chip and cloud suppliers to it financially.
2. **Distillation defences** show model vendors tightening API access to reasoning, which affects explainability, fine-tuning and contract terms.
3. **Agents inside data operations** (Genie ZeroOps) and **on the desktop** (Gemini on Mac) are shipping in beta or limited form, and identity and approval controls are the gating issue.

The trend: capability is moving into operations faster than governance, so identity, scoped permissions and audit logging decide what can be deployed. A date to plan around is 2 December for EU AI Act marking obligations.

---

## Daily learning skill: golden-set regression tests for prompt and model changes

**The concept:** A golden set is a fixed list of inputs with known good answers (or known good properties of answers). Every time you change a prompt, a model version or a retrieval setting, you rerun the whole set and compare. It is the same idea as regression tests in software, applied to AI output.

**Example (financial services):** A bank uses an LLM to extract the counterparty, notional and maturity date from term sheets. It keeps 30 anonymised term sheets with hand-checked fields. Before moving to a newer model, it runs all 30 and compares field by field, and also checks cost and latency. A new model that scores higher on average but breaks maturity dates for one product type shows up immediately, before customers see it.

**Exercise (2 to 5 minutes):** Pick one AI task you rely on. Write down 10 realistic inputs, including 2 awkward ones (missing data, odd format). For each, write the expected answer in one line. Add one column named "must never happen" (for example, "invents a date"). That is a first golden set. Next time you change a prompt, run the 10 and count passes and "never" violations.

**Why it matters today:** With vendors releasing new model versions every few weeks, a small golden set is the cheapest way to decide whether to upgrade.

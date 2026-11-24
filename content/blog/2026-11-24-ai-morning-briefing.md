---
title: "AI Morning Briefing: Tuesday 24 November 2026"
date: "2026-11-24"
description: "Anthropic's Claude Ship lets agents approve pull requests under written policy, the UK FCA says firms stay accountable for AI agents, Nvidia reinstates its CEO, and Amazon's Decart deal stays unconfirmed."
tags:
  - AI
  - Data Platforms
  - Financial Services
---

**Window covered:** Monday 23 November 2026, 07:30 to Tuesday 24 November 2026, 07:30 (Europe/Zurich).

**Headline:** A moderate news day. The most consequential items are Anthropic handing pull-request approval to agents under a written policy, and the UK FCA restating that firms remain responsible for the AI agents they use.

---

## AI agents and applications

### Anthropic launches Claude Ship: agents that review, fix and approve pull requests — 23 Nov 2026 — [SiliconANGLE](https://siliconangle.com/2026/11/23/anthropics-claude-ship-automates-the-final-stage-of-the-software-development-pipeline/)

Secondary coverage: [9to5Mac](https://9to5mac.com/2026/11/23/anthropic-launches-new-claude-ship-feature-for-builders/), [MarkTechPost](https://www.marktechpost.com/2026/11/23/anthropic-claude-ship-pull-request-agents/). Anthropic's own blog post could not be retrieved, so details below come from press coverage quoting it.

**What happened:** Claude Ship bundles three agents for the stage after code is written. Code Review is generally available. PR Steward (fixes failing CI checks, merge conflicts and review feedback, and comments on what it changed) and Claude Approvals are in beta. Claude Approvals can approve routine pull requests against an approval policy that lives as a file in the repository, written in natural language and able to draw on Code Review findings and an organisation's own classifiers. Anthropic advises starting in observe-only mode.

**Available now:** Claude Team and Enterprise organisations, GitHub repositories only, enabled per repository by admins, with a `/ship` command in Claude Code. Usage is billed by tokens separately from plan allowances. Organisations using Zero Data Retention, HIPAA configurations or customer-managed encryption keys are excluded, according to press coverage. Reporting notes that Anthropic has published no benchmark; any performance claims are self-reported.

**Why it matters:** Code generation is now faster than human review, so approval is the new bottleneck. For data platform and analytics teams, the same pattern applies to dbt models, pipeline code and infrastructure as code. In financial services, an agent that can approve changes touches change-management and segregation-of-duties controls.

**Implications:**
- Treat the policy file as a controlled artefact: who can edit it, and is it reviewed like code?
- Run observe-only first and compare agent decisions with human decisions before delegating anything.
- The exclusions for ZDR, HIPAA and customer-managed keys will rule out many regulated environments for now.

---

## Governance, security, privacy and regulation

### UK FCA sets out its approach to agentic AI: accountability stays with firms — 24 Nov 2026 — [Resultsense](https://www.resultsense.com/news/2026-11-24-fca-agentic-ai-firms-stay-responsible/)

Secondary coverage: [PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/fca-warns-companies-against-unregulated-agentic-activity/). The FCA's own page was not retrieved; this relies on press summaries, so check fca.org.uk for exact wording.

**What happened:** According to press reports, the FCA said technology firms must consider whether their AI agents are providing regulated services (financial promotions, advice, payments), and that calling yourself a technology provider does not create an exemption. Regulated firms that build, deploy or rely on third-party agents remain accountable, as do their senior managers. The FCA also expects clear disclaimers on AI-generated financial information and plans an "Agentic Policy Sprint" with industry. Reports link the timing to a consumer agent launch in the UK; the FCA reportedly named no company.

**Why it matters:** This is principle-based supervision applied to agents, not a new rulebook. It matches the direction of the earlier FCA good and poor practice material ([Freshfields summary](https://www.freshfields.com/our-thinking/briefings/2026/10/ai-in-financial-services-fca-good-and-poor-practice-and-the-road-to-agentic-finance)) and Federal Reserve Governor Barr's 12 November remarks on banks keeping agents aligned with customer instructions (speech-level warning, reported by [Crypto Briefing](https://cryptobriefing.com/fed-barr-agentic-ai-banks-challenges/)).

**Implications:** Firms using vendor agents cannot outsource accountability. Expect questions on agent identity, delegated authority, logging and incident reporting. Swiss readers should note FINMA's Guidance 08/2024 is still the main reference, and I found no new FINMA AI publication this week.

---

## Business adoption

### Nvidia's board reinstates Jensen Huang as CEO — 23 Nov 2026 — [The Neuron](https://www.theneuron.ai/digest/everything-that-happened-in-ai-today-november-24-2026/)

**What happened:** Per this digest, Nvidia's board voted unanimously on 23 November to bring Huang back as president, CEO and director, 11 days after he resigned. The digest says senior US government officials were involved in the reversal. I did not retrieve a primary Nvidia filing, so treat the details as reported, not confirmed.

**Why it matters:** Nvidia's governance and leadership affect GPU supply planning and pricing assumptions for any AI infrastructure roadmap. The immediate operational impact on customers looks limited.

### Amazon and Decart: talks, not a completed deal — reported since October — [TechRepublic](https://www.techrepublic.com/article/news-amazon-decart-ai-acquisition-talks/)

**Status:** One daily digest this morning described this as an agreed acquisition at about $7.5B. The sources I could check describe reported talks at roughly $7B, first reported by the Wall Street Journal on 11 October, with no announced deal. Treat it as unconfirmed. If it completes, the interest is Decart's software for running models efficiently across Nvidia, Google and Amazon chips, which could lower portability costs between hardware platforms.

---

## Research and evaluations

### Background: DeepMind and Google Quantum AI use agents and Lean proofs to cut quantum algorithm costs — preprint, early November — [The Quantum Insider](https://thequantuminsider.com/2026/11/10/google-researchers-use-ai-and-mathematical-proofs-to-cut-quantum-computing-requirements/)

This was republished in today's digests but is older than the window (coverage dated 10 November), so it is marked as background. Per reporting on the preprint (not peer reviewed), agents propose quantum programs and a Lean proof checker accepts only ones with proofs of correctness and cost. Headline gains include a reported 290x cost reduction on one subroutine, measured against the authors' own baselines. The wider point for enterprise AI is the pattern: pair a generative agent with a formal verifier so outputs are checked mechanically.

---

## Other notable updates

- **Not confirmed:** Digests mention a "GLM-5.4" from Z.ai. I found no official release or weights; the latest confirmed open-weights release is GLM-5.3 from late August, with a changed licence ([The New Stack](https://thenewstack.io/zai-glm-weights-license/)).
- **Not confirmed:** A digest item that Google's AI Mode in Search can read Wallet data. I could only verify Google's earlier [Personal Intelligence in AI Mode](https://blog.google/products-and-platforms/products/search/personal-intelligence-ai-mode-search/) (Gmail and Photos, January).
- **Background (13 Nov):** OpenAI's [ChatGPT Wallet](https://openai.com/index/introducing-chatgpt-wallet/) lets agents pay with tokenised cards, with biometric approval, for US Pro users. Relevant to the FCA's accountability point above.
- **Background (Snowflake, 3 Nov):** Business Ontology, Cortex AI Gateway and autonomous data-engineering agents ([SiliconANGLE](https://siliconangle.com/2026/11/03/snowflake-expands-agentic-ai-platform-with-business-context-and-governance-tools/)). Databricks added Unity Gateway Insights in beta on 17 Nov ([release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/november)).
- **Reminder:** EU AI Act transparency and labelling grace period ends 2 December 2026; high-risk obligations were deferred to December 2027 and August 2028 ([Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/), secondary source).

---

## Overall take

1. **Claude Ship** moves agents from suggesting changes to approving them. The control question is the policy file and who owns it.
2. **The FCA statement** makes the same point from the regulator's side: delegation to an agent does not delegate accountability.
3. **Trend:** the next phase of agent adoption is about authority, approval and audit trails, not raw capability. Several of today's digest items were unconfirmed or garbled, a reminder to check primary sources before acting on headlines.

---

## Daily learning skill: shadow mode before delegating approvals

**The concept:** Before an agent is allowed to decide, run it in shadow mode: it makes a decision on every case, but a human still decides, and nothing the agent says takes effect. After a few weeks you compare the two. The key numbers are agreement rate, and for each disagreement, who was right. This gives evidence for how much authority to delegate.

**Example (financial services / data platform):** A bank's data team lets an agent review changes to a reporting pipeline. In shadow mode it labels each change "approve" or "needs human review". The team records the agent's label next to the reviewer's decision. If the agent said "approve" on 200 changes and a reviewer later rejected 6, the team inspects those 6. Were they high-impact (a regulatory report) or cosmetic? Authority is then granted only for the categories where the agent had no costly misses.

**Exercise (3 to 5 minutes):** Pick one approval you do regularly. Write 10 recent cases in a table with columns: case, your decision, what an agent would plausibly decide, impact if the agent were wrong (low/medium/high). Mark any case where a wrong "approve" would be high impact. Those are the categories that should stay with a human regardless of agreement rate.

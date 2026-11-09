---
title: "AI Morning Briefing: Monday 9 November 2026"
date: "2026-11-09"
description: "A real-world coding benchmark where the best model fully solves only 26.4% of tasks, AI agents abusing leaked cloud secrets, a reported $3.4B Anthropic power deal, and Nvidia's Vera CPU for agents."
tags:
  - AI
  - Data Platforms
  - Financial Services
---

**Window covered:** Friday 6 November 07:30 to Monday 9 November 2026 (Europe/Zurich). The Saturday briefing already covered 6 and 7 November, so this edition focuses on what is new since then and on a few items from 5 and 6 November that were not covered before. Each is dated. A quiet weekend: few primary announcements, mostly research, security and infrastructure reporting.

**Headline:** A real-world coding test shows even the best agent model fully solves barely a quarter of tasks, while Microsoft documents attackers using AI agents to turn leaked cloud secrets into data theft within minutes.

---

## AI agents & applications

### Co-Design Bench: the best model fully solves 26.4% of real web-app change requests — 8 Nov 2026 — [The Decoder](https://the-decoder.com/ai-coding-agents-still-need-human-cleanup-on-nearly-three-out-of-four-tasks-in-a-real-world-test/)

**What happened:** Researchers from Alibaba and several Asian universities built a benchmark of real user change requests for reworking existing web applications. Across ten models, the top performer (GPT-6 Astra) met about 70% of requirements on average but produced a fully correct result on only 26.4% of tasks. It fully solved 41% of multimodal tasks and just under 18% of tasks that involve whole repositories. Scores fell as tasks combined three or four kinds of change. The report also notes that one model's score moved between 75% and 56% depending on the harness (the scaffolding around the model). I read the press report, not the paper.

**Why it matters:** The gap between "mostly right" and "fully right" is what determines how much human clean-up an agent creates. The harness effect shows that a model's score belongs to a model-plus-tooling combination.

**Implications:** When piloting coding agents for pipelines, SQL or reporting code, plan for review on every change and measure full-task success on your own repositories, not average requirement coverage.

---

## Governance, security, privacy & regulation

### Attackers use an agentic framework to turn leaked secrets into cloud data theft — published 5 Nov 2026 (background, not covered before) — [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/)

**What happened:** Microsoft Threat Intelligence reports that attackers have used an agentic offensive framework called ARTEX since August 2026 to search public GitHub repositories for exposed secrets. In a follow-on campaign that began as early as 28 October, stolen application credentials were used for service-principal sign-ins across dozens of applications and several Entra ID tenants. In one case, an agent went from finding a client secret on GitHub to exfiltrating data from Azure Key Vault in about five minutes. Microsoft's guidance: rotate exposed credentials (deleting them from code does not revoke them) and move OAuth apps away from secret-based authentication.

**Why it matters:** The time between a leaked credential and data loss is shrinking from days to minutes. Data platforms hold many service credentials (warehouse tokens, API keys, pipeline secrets), which makes them natural targets.

**Implications:** Prefer workload identity or short-lived tokens over long-lived secrets, run secret scanning on commits, and automate rotation so response does not depend on a person noticing.

### US President signals openness to AI guardrails — 9 Nov 2026 — [Reuters](https://www.reuters.com/world/trump-says-ai-risks-can-be-managed-signals-openness-guardrails-2026-11-09/)

**What happened:** Per the Reuters headline and a digest summary, Donald Trump said AI risks can be managed, that he does not mind guardrails and could work with Democrats on safeguards, while warning that regulation should not leave the US behind China. These are statements, not a policy or a bill. I did not read the full Reuters article.

**Why it matters:** For firms operating in the US, the direction of federal AI rules remains open. No new obligation arises from this today.

---

## Infrastructure & data platforms

### Nvidia positions its Vera CPU for agent workloads — 5 Nov 2026 — [NVIDIA blog](https://blogs.nvidia.com/blog/vera-cpu-highest-throughput-fastest-agents/)

**What happened:** Nvidia argues that agents alternate between GPU reasoning and CPU work (running code, querying databases, calling tools), so CPU speed matters in power-limited data centres. In a 100 MW comparison it claims 1.6 times more agents per watt than the fastest x86 CPU. Partner figures include Perplexity at 1.5 times faster on agentic coding tasks and Daytona starting 1,000 agent sandboxes in 10.8 seconds against 88.4 seconds on x86. All figures are vendor-reported, and I did not find availability or pricing in the post.

**Why it matters:** As agents run more tool calls and database queries per task, the non-GPU part of the stack becomes a cost and latency factor, relevant to capacity planning for agent platforms.

### Anthropic reportedly takes over a $3.4B gas-power order — reported 8 Nov 2026 — [Financial Times](https://www.ft.com/content/41bf5c6a-9735-4f1a-a8e3-2bcccad58ba0)

**What happened:** Reporting (FT, with Reuters named in a digest) says Anthropic agreed in September to take over orders for gas-powered generators worth about $3.4B and 1.7 GW, originally placed through Texas-based OnePWR Solutions. **Unconfirmed:** neither company had publicly confirmed it in the coverage I read, and I could not open the FT article.

**Why it matters:** If accurate, it is another sign that power supply, not only chips, limits AI capacity. This is analysis, not a confirmed trend.

---

## Business adoption

### OpenAI reported to raise $11B at about a $1.25T valuation — 6 Nov 2026 — [Reuters](https://www.reuters.com/business/openai-secures-11-billion-funding-125-trillion-valuation-bloomberg-news-reports-2026-11-06/)

**What happened:** Reuters, citing a Bloomberg report, says OpenAI secured $11B as the first part of a larger round, with investors including SoftBank and MGX. The valuation is below the roughly $1.5T reportedly sought, and the round could reach about $20B. This relies on press reports, not an OpenAI statement.

**Why it matters:** Funding on this scale supports continued price and capacity competition among model providers, but also concentrates dependence on a few vendors. Consider multi-vendor routing in architecture designs.

---

## Other notable updates

- OpenAI is expanding external security testing with Hacktron, which gets extended model access through the Daybreak Red programme to examine risks when OpenAI systems connect to third-party services (6 Nov): [OpenAI](https://openai.com/index/partnering-with-hacktron/)
- OpenAI's BioBasicsBench, a 100-task test of agents interpreting lab data, reportedly scores GPT-6 Astra at 66.7% against 43.8% for GPT-5.6 Sol (vendor figures; I could not open the page): [OpenAI](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/)
- Tencent released its Hy4 open-source model, reportedly trained without offensive-hacking material: [Tencent](https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/)
- Bloomberg reports DeepSeek's agent platform has reached 1.54 million daily users (company-reported figure): [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users)
- New copyright lawsuits against AI music generator Suno from rights holders: [Engadget](https://www.engadget.com/2310316/suno-ai-music-generator-sued-again-for-copyright-infringement/)
- Rumour, not announced: Apple's new CEO is reportedly pushing for faster AI work, and Siri may become more agent-like as early as 2027: [MacRumors](https://www.macrumors.com/2026/11/08/siri-ai-rumored-to-become-more-agentic/)
- Unverified: one newsletter reports a Google DeepMind finding on weaknesses in 1024-bit RSA found with AI agents, with 2048-bit not affected. I found no primary source: [Aidapted digest](https://aidapted.ro/en/articles/ai-news-8-november-2026/)

---

## Overall take

1. **Agent reliability (Co-Design Bench):** average scores flatter agents; full-task success and harness choice decide real cost.
2. **Agents as attack tools (Microsoft ARTEX):** leaked credentials are now exploited in minutes, so credential hygiene is an AI-era control.
3. **Capacity limits (Nvidia Vera, Anthropic power report):** compute, CPUs and electricity are shaping who can scale agents.

**Trend:** agents are getting more capable for both builders and attackers, and the practical response is the same in both cases: measure on your own work, shrink what each credential can do, and keep a human check on the final result.

---

## Daily learning skill: the harness is part of the score

**The concept:** An evaluation score describes a model plus the code around it: the prompt template, the tools it can call, how many retries it gets, and how its output is checked. Co-Design Bench's reported swing for one model, from 75% to 56% depending on the harness, shows how large that effect can be. A benchmark number from a vendor therefore only transfers to your setup if your harness matches theirs.

**Example (financial services):** A team tests an agent that drafts SQL for a regulatory-reporting mart. With a harness that lets it run the query, see the error and retry three times, it succeeds on most tasks. In production the same agent is allowed one attempt, with no access to run queries, and results drop sharply.

**Exercise (3 to 5 minutes):** Pick five tasks you know the right answer to. Write down the exact harness settings for your test: tools allowed, retries, and who checks the output. Run the five tasks once with retries and once with a single attempt, and record "fully correct yes/no" for each run. The difference is the part of your result that depends on the harness, not the model. Use the setting that matches production when you compare models.

---
title: "AI Morning Briefing: Saturday 14 November 2026"
date: "2026-11-14"
description: "The Fed's stability report names AI the top-cited risk, the FBI warns of an AI attack framework hitting financial firms, OpenAI launches ChatGPT Wallet, and Microsoft 365 recovers from a two-day outage."
tags:
  - AI
  - Data Platforms
  - Financial Services
---

**Window covered:** Friday 13 November 2026, 07:30 to Saturday 14 November 2026, midday (Europe/Zurich). Items from before the window are included only where they add needed context and are marked as background.

**Today in one line:** Financial authorities moved AI to the top of the risk list on the same day that agents got a wallet, a US ground stop raised questions about a new AI tool, and Microsoft's cloud took two days to recover.

---

## Governance, security, privacy and regulation

### Fed Financial Stability Report: AI is now the most-cited risk to the US financial system — 13 November — [Federal Reserve report (PDF)](https://www.federalreserve.gov/publications/files/financial-stability-report-20261113.pdf), [CNBC](https://www.cnbc.com/2026/11/13/ai-risks-financial-system-federal-reserve.html)

**What happened:** The Federal Reserve published its November Financial Stability Report. In its survey of market contacts, AI was the top-cited risk. Respondents named three separate concerns: high equity valuations that depend on AI earnings, cybersecurity (attacks by state actors, or damage caused by frontier models themselves), and complex AI-related financing. CNBC reports that 87% of respondents cited AI, up from 50% in the spring survey, ahead of a risk-asset correction at 52%.

The report also puts numbers on the debt behind the build-out. Borrowing tied to advanced computing passed $680 billion by October 2026, about five times the $130 billion issued in all of 2023, and now makes up about 31% of non-financial investment-grade issuance, up from under 6%. The mix is shifting from plain corporate bonds towards private debt, structured credit and project finance, with large technology firms adding lease commitments and backstop guarantees.

**Caveats:** The survey covers 23 contacts and, in the Fed's own words, does not represent the views of the Board. It is a sentiment reading, not a forecast.

**Why it matters:** This is a central bank describing AI as a financial-stability topic through three channels at once: market, cyber and credit. For banks, insurers and asset managers, AI exposure now belongs in concentration and counterparty analysis, alongside the technology risk register.

**Implications:**
- Risk teams should be able to answer where the firm is exposed to AI build-out credit, directly or through funds and structured products.
- Expect supervisors elsewhere to ask similar questions. The report gives them a ready framework.
- For data teams, this means lineage for exposures tagged to data-centre, chip and "neocloud" counterparties, which most reference data does not yet flag.

### FBI warns that an open-source AI attack framework is being used against financial firms — 13 November — [FBI FLASH-20261113-001 (PDF)](https://www.ic3.gov/CSA/2026/261113.pdf), [GBHackers summary](https://gbhackers.com/fbi-warns-artex-ai-framework/)

**What happened:** The FBI issued a public advisory on ARTEX, an open-source framework that turns a plain-language goal into a multi-step intrusion carried out by LLM-driven agents. According to the advisory, attackers have used it since at least August 2026 against organisations in financial services, government, technology, energy, healthcare and other sectors. Some intrusions went from first targeting to privileged access in under three hours.

Two campaigns are named: attacks on South Korean financial institutions that took personal data on about 67,000 people, and a supply-chain compromise through ConnectWise Cloud Backup that reached more than 2,250 downstream tenants. ARTEX has no model of its own. It calls external ones, and the FBI says Chinese models, especially DeepSeek's Flash family, dominate attacker deployments because of cost and weak guardrails for requests framed as penetration testing. The original repository was removed in October, but forks and a commercial version remain, and researchers counted more than 1,600 exposed consoles in early November.

**Why it matters:** This is official confirmation of something that had been reported only in fragments: agentic tooling lets low-skilled attackers chain techniques quickly and against many targets at once. The window for detection and response shrinks from days to hours.

**Implications:**
- The FBI's recommendations are conventional but urgent: inventory every internet-facing application including partner portals and legacy services, move admin and deployment interfaces off the public internet, and apply least privilege to multi-tenant app permissions.
- Firms using ConnectWise integrations with Microsoft 365 are asked to review every tenant where the applications were ever authorised, searching by application ID.
- Monitoring should cover new credentials added to existing OAuth applications and unusual service-principal sign-ins, since the agents persist through identities that already have access.
- The advisory includes indicators of compromise; it recommends vetting them before blocking.

### US ground stop: officials say the FAA's new AI planning tool was not the cause — 13 November — [Al Jazeera](https://www.aljazeera.com/news/2026/11/13/us-grounds-all-flights-after-communication-issue), [GeekWire](https://www.geekwire.com/2026/dhs-chief-sees-no-microsoft-link-to-faa-ground-stop-says-possible-ai-role-being-investigated/), [Futurism](https://futurism.com/artificial-intelligence/us-airspace-shuts-down-faa-rolled-out-ai)

**What happened:** The FAA halted flights nationwide on Friday for several hours after a communications failure at its en-route control centres. Three days earlier it had expanded SMART, an AI traffic-planning tool from Air Space Intelligence, to all 22 of those centres. The timing prompted questions. The Homeland Security Secretary said a link had not been ruled out. Later the same day, the Transportation Secretary said SMART is not connected to the core systems controllers use, and officials blamed ageing telecom equipment. The vendor denies any role. Reports say the FBI sees no sign of a cyberattack, and officials also ruled out a link to the Microsoft outage.

**Status:** No connection between the AI tool and the outage has been established. A full investigation has been requested in the Senate, and no root-cause report is public yet.

**Why it matters:** Whatever the cause, the episode shows what happens when a new AI system goes live shortly before an unrelated failure: it becomes the first suspect, and the operator has to prove a negative.

**Implications:**
- Being able to show quickly that an AI component is isolated from a critical path is now an operational requirement. That means documented integration boundaries, change logs and independent monitoring.
- Staggered rollouts and change freezes around AI deployments make incident attribution easier.

---

## AI agents and applications

### OpenAI launches ChatGPT Wallet so its agents can pay — 13 November — [CNBC](https://www.cnbc.com/2026/11/13/openai-chatgpt-wallet-dot-purchases.html)

**What happened:** OpenAI announced ChatGPT Wallet, which lets its "dots" personal agents make purchases. Built with American Express, Mastercard and Visa, it works like this: the user enters a card once, asks the agent to find something, and approves each purchase through a security check. The agent never sees the card. The network issues a payment token with a card number, security code and expiry that are valid for that one transaction. Existing card rewards and protections are kept.

**Available now:** US Pro subscribers aged 18 and over. OpenAI says it takes no cut of transactions at launch. Fully delegated purchasing without per-purchase approval is described as a later step, with no date.

**Why it matters:** The three largest card networks are now issuing transaction-scoped credentials to an AI agent. That settles the basic pattern for agent payments: tokenised, single-use, and approved by a person. It also puts card issuers in the position of authorising transactions started by software acting for the cardholder.

**Implications:**
- Issuers and acquirers need a way to recognise agent-initiated transactions in fraud models, dispute handling and customer-authentication rules. In Europe, how this fits strong customer authentication is an open question, and there is no EU launch yet.
- Merchants should expect checkout traffic from agents and decide whether to support or block it. Earlier this week United Airlines chose to block.
- Transaction data will need an "initiated by agent" attribute. Few payment schemas have one today.

### Personal Agent Protocol 1.0 goes live in Meta's Muse and on every Shopify store — 13 November — [Sierra](https://sierra.ai/blog/releasing-poppy)

**What happened:** Sierra released version 1.0 of Personal Agent Protocol, known as Poppy, an open standard it develops with Meta and others. It defines how a person's AI agent identifies itself to a company, learns what it is allowed to do, and then acts through the company's agent, website or APIs. It builds on existing standards such as MCP, OpenAPI and OAuth, so the customer grants and can later withdraw the agent's permissions.

**Available now:** Meta's Muse agent looks for a Poppy file first on every site it visits. Every Shopify store publishes one automatically. Mercury, Synchrony and Turkish Airlines are among the companies live. Sixty more design partners joined, taking the total above 100, including Navy Federal Credit Union, SoFi, Banco Sabadell, Aviva, Travelers, Affirm, Checkout.com, Global Payments, Intuit and Salesforce. An implementation kit with a validator is public.

**Why it matters:** Until now a company had two options when a customer's agent arrived: let it scrape the site like a browser, or block it. Poppy offers a third, a declared front door with scoped, revocable access. The number of banks, insurers and payment firms on the partner list suggests financial services sees this as the workable route.

**Implications:**
- For architects, this is another agent-facing interface to own, next to MCP servers and public APIs. It needs the same API governance, rate limits and audit logging.
- OAuth scopes become the control point for what customer agents may do, so consent design and scope granularity matter.
- This is a vendor-led standard that is five weeks old. Adoption is fast, but it has no standards-body backing yet, and OpenAI and Google have not announced support.

---

## Infrastructure and data platforms

### Microsoft 365 outage ends after roughly two days; Copilot was affected, not the cause — 12 to 14 November — [Al Jazeera](https://www.aljazeera.com/news/2026/11/13/microsoft-hit-by-global-outages-what-happened-and-why), [Digital Trends](https://www.digitaltrends.com/computing/microsoft-365-outage-resolved/), [BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/massive-microsoft-365-outage-disrupts-outlook-teams-copilot-worldwide/)

**What happened:** Outlook, Teams and Copilot were disrupted for users in 74 countries from about 16:00 GMT on Thursday. Microsoft first suspected high traffic, then said a number of backend servers had become unavailable without any traffic increase. Restored servers failed again overnight, and the company reported only "marginal success" on Friday morning. On Saturday it said service was restored for remaining customers.

**What is confirmed and what is not:** Microsoft has said the incident was a technical issue and not related to a cyberattack or to AI. One outlet reports that the company traced it to an earlier network capacity upgrade that a later network change exposed. That explanation is from a single secondary source; the formal post-incident report is still to come.

**Why it matters:** Many firms now run email, meetings, documents and their main AI assistant on one provider. A two-day outage tests business-continuity plans that assumed hours.

**Implications:**
- Check whether continuity plans cover a multi-day loss of the collaboration suite, including any Copilot-dependent workflows that have no manual fallback.
- For regulated firms, this is a live case for operational-resilience and concentration-risk reporting under rules such as DORA.
- Read the post-incident report when it is published before drawing conclusions about root cause.

### Nvidia after Huang: successor search, Senate hearing request and a stalled financing programme — 13 to 14 November — [RTE on the FT report](https://www.rte.ie/news/business/2026/1113/1599163-nvidia-approached-arm-ceo-haas-to-succeed-huang-ft/), [Fortune](https://fortune.com/2026/11/13/senate-banking-committee-nvidia-jensen-huang-howard-lutnick/), [CNBC](https://www.cnbc.com/2026/11/12/nvidia-ceo-exit-ai-financing.html)

**What happened:** Three developments followed Thursday's resignation.
- **Succession (reported):** The Financial Times reports that Nvidia's board has approached Arm chief executive Rene Haas, a former Nvidia executive, as one of several candidates. Nothing is agreed.
- **Congress:** The Senate Banking Committee chair asked Jensen Huang and Commerce Secretary Howard Lutnick to testify in December, citing national-security concerns, and said a subpoena is possible. Reports differ on the exact dates (3 and 10 December).
- **Financing (reported, published 12 November):** CNBC reports that Nvidia's August arrangement with six large asset managers and banks to mobilise more than $500 billion for AI data centres has produced no deals, with lenders seeking a larger residual-value guarantee on GPUs used as collateral.

The underlying allegations about Huang remain unproven, and reporting on the board's internal review continues ([Reuters](https://www.reuters.com/world/china/ex-nvidia-ceo-misled-top-lawyer-affair-with-chinese-businesswoman-sources-say-2026-11-14/)).

**Why it matters:** The financing point connects directly to the Fed's report. GPU-backed lending depends on what a three-year-old accelerator is worth, and the main party willing to guarantee that value has just lost the executive who drove the deals.

**Implications:**
- Third-quarter results on Tuesday 17 November are the first chance to hear the interim leadership on supply commitments and financing.
- Buyers negotiating multi-year capacity should ask providers how their hardware is financed and what happens if that financing reprices.

---

## Research and evaluations

### Amazon and University of Washington study: a single agent is the efficient default — background, submitted 7 November — [arXiv 2611.12953](https://arxiv.org/abs/2611.12953)

**What happened:** This preprint circulated widely this week. The authors held the model, tasks and tools fixed and varied only the agent architecture across 13 enterprise-style standard operating procedures. They compared a single function-calling agent, a skill-augmented agent, a centrally orchestrated multi-agent setup and a triage swarm.

**Findings:** No architecture was best overall. Results depended on the procedure, with success from under 10% on the hardest to near 100% on the easiest. The coordinated designs used 1.4 to 4.7 times the tokens and 2.6 to 5.8 times the latency of the single agent, for gains that were usually small and rarely significant. Well-written skill definitions raised success from 67.4% to 73.1%; poorly written ones made it worse than no skills at all.

**Caveats:** A preprint, not peer reviewed, with one model and synthetic procedures.

**Why it matters:** Many enterprise agent designs start with multiple agents because the pattern looks robust. This is controlled evidence that the extra structure costs several times more and often buys little, and that the quality of written instructions matters more than the diagram.

**Implications:** Start with one agent and good procedure documents. Add orchestration only for a specific branching process where a test shows a gain that justifies the cost.

---

## Business adoption

### LangChain raises $300 million at a $3 billion valuation — 13 November — [LangChain](https://www.langchain.com/blog/series-c), [TechCrunch](https://techcrunch.com/2026/11/13/ai-agent-startup-langchain-hits-3b-valuation/)

**What happened:** LangChain announced a Series C led by CapitalG, with GIC, DFJ Growth, IVP and Sapphire Ventures. The valuation is more than double the $1.25 billion of a year ago. The company says LangSmith, its tool for tracing, evaluating and governing agents built on any model or framework, has 7,000 customers.

**Why it matters:** Investors are funding the layer that observes and controls agents separately from the model vendors. The pitch, that a business should own its agent logic and evaluation data whichever model it uses, matches how regulated firms want to buy.

**Implications:** Agent observability is becoming a product category of its own. When choosing, weigh model-neutral tooling against the monitoring built into each model vendor's platform, and check where trace data, which contains prompts and outputs, is stored.

---

## Other notable updates

- OpenAI has folded its stand-alone robotics team into its research and applied groups, saying general models can now run robots. [Fortune](https://fortune.com/2026/11/13/openai-disbands-robotics-team-as-its-general-models-start-running-robots/) (exclusive, single source)
- Reported: an internal Amazon plan called World Product Graph would collect data on nearly every product sold worldwide, partly to counter third-party shopping agents. [Reuters](https://www.reuters.com/business/media-telecom/amazons-plan-own-worlds-product-data-fight-ai-shopping-agents-2026-11-13/) (document reviewed by Reuters; not confirmed by Amazon)
- Reported: the White House AI task force recommended at least a year of regulatory flexibility for AI companies that voluntarily disclose cyber incidents or vulnerabilities. Non-binding. [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-14/white-house-urges-easing-liability-to-encourage-ai-disclosure)
- DeepSeek opened its app's web search, file reading, safety checks and speech tools as separate APIs on a new Flash model. [TokenPost](https://www.tokenpost.com/news/technology/56779) (secondary source)
- Tencent released Hy Realtime, a voice model that decides during a conversation whether to call web tools; a cloud API is promised without a date. [Pandaily](https://pandaily.com/tencent-hunyuan-hy-realtime-voice-model-tool-calling-singing-yuanbao/)
- Perplexity brought its Teammates background agents to the Mac app for subscribers on its $200 a month plan. [9to5Mac](https://9to5mac.com/2026/11/13/perplexity-brings-ai-agents-feature-called-teammates-to-the-mac/)
- Mirendil, founded by former frontier-lab researchers, raised $1 billion to build tools that automate AI research. [Press release](https://www.prnewswire.com/news-releases/mirendil-raises-1b-to-democratize-frontier-ai-rd-302937248.html)
- UK, 12 November (background): an FCA official said the regulator intends to use agentic AI in its own supervision, following the Mills Review. [National Law Review](https://natlawreview.com/article/agentic-ai-personal-assistant-uk-supervisory-tool) (law-firm summary)
- Anthropic IPO (background): the company's roadshow notice gives a $70 to $78 range, with pricing expected around 18 November and Nasdaq trading the next day. [Anthropic](https://www.anthropic.com/news/roadshow-launch)
- EU reminder: the AI Act's transparency-marking duties for generative systems already on the market, and new prohibitions set by the AI Omnibus, apply from 2 December 2026. [European Commission](https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force)

---

## Overall take

1. **The Fed report** changes how AI risk is framed for financial firms. It is a market, cyber and credit exposure at the same time, and $680 billion of computing-related debt gives that a number.
2. **The FBI advisory** confirms that agent-driven attacks are in production against financial institutions, with breach timelines in hours. It arrived in the same week the Fed's respondents listed AI-enabled cyberattacks as a top concern.
3. **Agent commerce got its plumbing.** Card networks are issuing single-use tokens to agents, and a protocol for agent access went live across Shopify and a long list of banks and insurers.

The trend: agents are being given real authority, to pay, to transact and to attack, faster than the systems around them can attribute what happened. The FAA and Microsoft incidents show how hard it is to prove what did or did not cause a failure. Attribution, isolation and audit trails are the capabilities to invest in.

---

## Daily learning skill: cost per successful task

**The concept:** Model prices are quoted per token, but a business pays for finished work. Cost per successful task is the total spent on all attempts, plus the cost of handling the failures, divided by the number of tasks that were completed correctly. A setup that looks cheaper per token can be more expensive per result, and a setup that looks more accurate can cost more than the accuracy is worth.

**Example:** A bank automates a document-checking procedure. The figures below are illustrative.

- **Single agent:** 40,000 tokens per task, $0.20 model cost per task, 67% success rate.
- **Multi-agent:** 120,000 tokens per task, $0.60 model cost per task, 71% success rate.

Model cost per successful task is $0.20 / 0.67 = $0.30 for the single agent and $0.60 / 0.71 = $0.85 for the multi-agent setup. Now add the failures. If each failed task goes to a person at $4, the full cost per task is $0.20 + 0.33 x $4 = $1.52 for the single agent and $0.60 + 0.29 x $4 = $1.76 for the multi-agent one. The more complex setup loses on both measures. It would only win if failures were much more expensive, or if its success rate were much higher.

This mirrors the study above, where coordinated agents used up to 4.7 times the tokens for small gains.

**Exercise (5 minutes):** Pick one AI workflow in use or under evaluation.
1. Write down the average model cost per attempt and the success rate. Estimate them if they are not measured.
2. Estimate what one failure costs: review time, rework, or a customer complaint.
3. Compute cost per task = model cost + (failure rate x failure cost).
4. Ask what success rate a more expensive option would need to reach to break even.

If steps 1 or 2 cannot be answered, that is the finding: the workflow is being run without the two numbers that decide whether it pays.

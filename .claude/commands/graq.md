Smart query router for project knowledge. Classifies the user's question and picks the cheapest approach that gives a correct answer.

IMPORTANT: When the user explicitly says "use graqle", "ask graqle", "graqle reason", or "use the knowledge graph" — skip classification and go directly to the appropriate GraQle MCP tool. Do NOT fall back to grep/read when the user explicitly wants GraQle.

## Decision Tree — Execute in order, stop at first match

### Step 0: Check for explicit GraQle request

If the user said "use graqle" or similar, go directly to Step 2 and pick the MCP tool that matches:
- Impact/dependency questions -> `graq_impact`
- "What breaks / what depends" -> `graq_impact`
- "Why / how / explain" -> `graq_reason`
- Safety / preflight checks -> `graq_preflight`
- Past mistakes / lessons -> `graq_lessons`
- "Tell me about X" / context -> `graq_context`
- "Remember / teach" -> `graq_learn`
- Graph stats -> `graq_inspect`
- Everything else -> `graq_reason`

### Step 1: Classify the query

Read the user's question (passed as $ARGUMENTS) and classify it into ONE of these categories:

| Category | Pattern | Examples |
|----------|---------|----------|
| **LOOKUP** | Single fact, named entity, "which X does Y" | "Which Lambda creates manifest?", "What's the Neo4j URI?", "What env vars does L03 need?" |
| **CROSS-CUT** | Spans 3+ components, services, or files | "What services depend on Neo4j?", "Which Lambdas use shared/tamr_retrieval.py?", "What modules does L06 import?" |
| **IMPACT** | "What happens if", "what breaks", change analysis | "What breaks if I remove trace_scoring.py?", "Impact of changing Neo4j schema?" |
| **REASONING** | Why/how questions, architectural, multi-hop | "Why does TRACE score drop for single-doc queries?", "How does the document pipeline work end-to-end?" |
| **PREFLIGHT** | About to change code, need safety check | "What should I check before modifying L03?", "Any gotchas for CORS changes?" |
| **LESSONS** | Past mistakes, failure patterns | "What went wrong with document naming?", "Common deployment failures?" |

### Step 2: Route to the right approach

#### LOOKUP -> Direct grep/read (cost: 100-500 tokens)
```
1. Grep for the key term in .gcc/project-kg.md (or graqle.json)
2. If found -> return the relevant rows/section. DONE.
3. If not found -> grep tasks/lessons-distilled.md
4. If still not found -> escalate to CROSS-CUT
```
**Tools:** Grep, Read (targeted lines only)

#### CROSS-CUT -> Targeted read or graq_context (cost: 300-800 tokens)
```
1. Read only the relevant section(s) of .gcc/project-kg.md
2. If project-kg.md doesn't have the relationships -> call graq_context
3. Synthesize answer. DONE.
```

#### IMPACT -> graq_impact MCP tool (cost: ~800-1500 tokens)
```
1. Call graq_impact with the component name
2. Present the impact trace to the user
```
**This is where GraQle earns its keep** — traversing dependency chains automatically.

#### REASONING -> graq_reason MCP tool (cost: ~1500-3000 tokens)
```
1. Call graq_reason with the question
2. If confidence < 0.5, supplement with targeted file reads
3. Present synthesized answer
```
**This is GraQle's sweet spot** — multi-hop reasoning across nodes.

#### PREFLIGHT -> graq_preflight MCP tool (cost: ~500-1000 tokens)
```
1. Call graq_preflight with the action and files
2. Present warnings, lessons, and safety boundaries
```

#### LESSONS -> graq_lessons MCP tool (cost: ~400-800 tokens)
```
1. Call graq_lessons with the operation
2. Present matched lessons with severity
```

### Step 3: Report the routing decision

Always start your response with a one-line routing tag so the user sees the cost/benefit:

```
[GRAQLE: {CATEGORY} -> {approach} | ~{estimated_tokens} tokens]
```

Examples:
- `[GRAQLE: LOOKUP -> grep project-kg.md | ~200 tokens]`
- `[GRAQLE: IMPACT -> graq_impact | ~1200 tokens]`
- `[GRAQLE: REASONING -> graq_reason (3 rounds) | ~2500 tokens]`

### Step 4: Answer the question

After routing, answer the user's question using the chosen approach. Be concise. Cite the source (file:line or GraQle node IDs).

## Token Budget Summary

| Approach | Typical cost | When to use |
|----------|-------------|-------------|
| Grep project-kg.md | 100-300 tokens | Single fact, named entity |
| Read section of KG | 300-800 tokens | Cross-referencing 2-3 tables |
| graq_lessons | 400-800 tokens | Past mistake patterns |
| graq_preflight | 500-1000 tokens | Pre-change safety check |
| graq_impact | 800-1500 tokens | Change impact analysis |
| graq_reason | 1500-3000 tokens | Multi-hop reasoning, "why" questions |

## Rules

1. **User says "use graqle" = use GraQle.** No second-guessing. Call the MCP tool.
2. **Cheapest first (when auto-routing).** Try grep before MCP tools.
3. **Always show the routing tag.** Transparency builds trust.
4. **Escalate, don't guess.** If grep returns nothing, escalate to the next tier — don't fabricate.
5. **Cache awareness.** If project-kg.md was already read this session, reuse from memory — don't re-read.
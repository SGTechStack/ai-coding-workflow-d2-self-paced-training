# Narration Video Plan — LLM & Agent Foundations (Track B, Topics 1–4)

This file **is the brief**. Per `video-generator` SKILL.md material precedence, a user-supplied
plan is not re-derived. Anything left vague here gets invented at build time, so it is specified.

Subject: the `LLM & Agent Foundations` track of `docs/index.html` (`#track-b`), Topics 1–4.
Out of scope: Track A (Matt Pocock workflow), Lesson 0, Lesson 1, Lesson 2.

---

## 1. Brief

| Field | Value |
|---|---|
| Audience | Developers training to become AI-native. Assume strong engineering, no LLM internals. |
| Goal | Build the conceptual foundation for Lessons 1–2. Comprehensiveness over brevity. |
| Runtime | ~22 minutes, 54 scenes. Not a constraint; set by concept coverage. |
| Tone | Second person, present tense, direct instructional. No hype vocabulary. |
| Language | British / Singapore English. Card titles quoted as printed. |
| Narration source | Verbatim in §6. Also the burned-in caption text. |
| Output | `docs/videos/llm-agent-foundations.mp4`, 16:9, 1920×1080. |
| Deck by-product | `png`, `pdf`, `html` — 11 slides, no extra render cost. |
| Ending | Summary of the four topics. **No call to action.** |

### The three claims

1. **Every rule in this workflow traces to a measurable model limit, not a preference.**
2. **Context is a budget you spend, not a container you fill.**
3. **Only a machine-verifiable signal can close an agent loop; everything else is a gate you place deliberately.**

---

## 2. Decision log

Settled. Recorded with rejected options so they are not re-litigated.

| # | Decision | Rejected |
|---|---|---|
| 1 | **One continuous video**, chapter cards for navigation. | Four per-topic videos; 20 micro-videos; two videos. |
| 2 | **Teach beyond the page.** Narration adds mechanism the page has no room for. Duration unconstrained. | Page-faithful recital (~10 min); 40-min lecture. |
| 3 | **The docs page is the camera subject.** No lab app, no purpose-built demo page. | Purpose-built lab captures; hand-recorded live agent sessions; generated footage. |
| 4 | **Six diagram slides in the deck.** `docs/index.html` is **not edited**. | Six new page figures; zero diagrams; slides for all 21 concepts. |
| 5 | **Mirror the page exactly.** No corrections in narration. Known imprecisions recorded in §9, not narrated. **One authorised exception:** the RAG/MCP distinction in S22 and S23 is corrected, per §9 item 8. | Correct in page and narration; correct in narration only; correct a subset. |
| 6 | **Page-order traversal, SCR framing at the seams.** Four-beat template per concept: Anchor → Mechanism → Failure → Practice. Misconception beat added selectively. | Two beats; five beats everywhere; dependency-ordered curriculum; thematic arc. |
| 7 | **Food-for-thought questions skipped entirely.** Learners answer them on the page. | Pause-and-answer prompts; on-camera reveals; closing checkpoint block. |
| 8 | **Light theme pinned via `setupScript`; viewport 1440×810; emphasis by `highlight` + ROI.** | Dark theme; on-camera theme toggle; true 1920 viewport; sub-1400px viewport; full-page stitching. |
| 9 | **Kokoro TTS, female voice.** Provider is a late, cheap decision — `synthesize.mjs` is resumable, so switching re-runs synthesis and composition only, never capture. | `gemini`/`openai`/`elevenlabs` from the start; `edge` (licence); `system` (non-reproducible); human narrator (no supported audio path). |
| 10 | **This session produces the plan only.** No bootstrap, no `storyline.yml`, no capture. | Plan + storyline; plan + full build through the gate. |
| 11 | **Layouts from `recommendLayout()` rules**, declared explicitly. | — |

### Why layout advice did not come from `modern-web-guidance` or Astryx

`references/slide-layouts.md` is explicit: `modern-web-guidance` is a web-platform feature corpus
with no taxonomy of layouts by content type, and ships no grid, subgrid or aspect-ratio recipes.
It is valid for *how* a layout is implemented, never *which* layout suits content. Per the header
comment in `scripts/lib/guidance.mjs`, the four features it motivated — `text-wrap: balance`/`pretty`,
`text-box: trim-both`, `font-size-adjust` — are **already baked into `slideCss()`**. We author
structured content against fixed layouts and never write slide HTML, so the 37 MB opt-in install
(Node ≥20) would add nothing.

Astryx was read for one thing only — how a mature system arranges a dominant card against
supporting ones — which confirmed `spotlight` for the orchestrator topology. It is never a
dependency: React 19 plus a StyleX compiler, and an unverified licence for vendoring token values
(assumption U5). No token values copied.

---

## 3. Deck header

```yaml
deck:
  title: LLM and Agent Foundations
  archetype: scr
  engine: html
  theme: light
  aspect: landscape
  outputs: [{ aspect: landscape }]
  formats: [png, pdf, html]
  voice: { provider: kokoro, gender: female }
  baseUrl: http://127.0.0.1:4173
```

No `design:` key. The bundled Inter + built-in light tokens are already near the page's own
palette (`--orange: #ea580c`, `--text: #0f172a`). Brand extraction is available later via
`deck.mjs --extract-brand=`, and is deliberately not on the critical path.

`outputs` is landscape only. Each extra aspect re-renders every scene and burns its own
subtitle track.

---

## 4. Capture setup

### Static server

```bash
npx --yes serve docs -l 4173
```

All capture URLs are relative: `/index.html#phase-llms` etc.

### Per-entry capture fields

```yaml
viewport: { width: 1440, height: 810 }
setupScript: setup/pin-light-theme.mjs
```

`viewport` is a real per-entry field (`lib/deck.mjs` → `scene.viewport`). It is the mechanism for
readable text: `capture.mjs` hardcodes `deviceScaleFactor: 1`, so scale cannot be raised there.
Capturing at 1440×810 and letting compose conform to 1920×1080 yields the same 1.333× effect.
Cost: mild upscale softness, accepted in exchange for body text at ~17 effective pixels instead
of 12.6.

1440 is the floor, not a preference: `.page-sidenav` renders only at `min-width: 1400px`, and its
scroll-spy `.active` state is the video's free progress indicator. At 1440 the sidenav occupies
x≈60–268 while `.page-wrap` (max 880px, centred) starts at x=280 — no overlap.

### `setup/pin-light-theme.mjs`

```js
export default async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('eitri-theme', 'light'));
};
```

Required, not cosmetic. The page's inline head script resolves its theme from
`localStorage.getItem('eitri-theme')` falling back to `prefers-color-scheme`, so an unpinned
theme makes captured pixels a property of the capture machine. Light also keeps the burned-in
caption box readable: captions are white on opaque `#0F172A`, which is the page's own dark
background — on dark theme the box dissolves into the page.

### Determinism

- `meta.fixedTime` — set it. Cheap, and removes a whole class of drift.
- `animations: 'disabled'` on stills.
- `appVersion` joins the capture cache key. Commit or stash before capture: a dirty tree counts
  as its own version and forces re-capture.
- Each scene opens its own context and loads its own anchor URL, so the `scroll` deltas below are
  measured from a known position rather than accumulated across scenes.

### Scene mechanics

Every capture scene is the same three-part shape:

1. `url` with a topic fragment — `#phase-llms`, `#phase-engineering`, `#phase-principles`,
   `#phase-multiagent`. Native fragment navigation scrolls deterministically, and the page sets
   `scroll-margin-top` on `[id]`.
2. One `scroll` step (`{ action: scroll, delta: <px>, delayMs: 500 }`). `scroll` is a relative
   mouse wheel, so **deltas below are first estimates and must be tuned in one dry capture pass.**
3. One `highlight` step naming the card by text. `highlight` is first-party — it calls
   `screencast.showOverlay` and sets the scene ROI to the element's bounding box. Never inject
   outline CSS.

Anchor+Mechanism scenes run at full column width. Failure+Practice scenes add an explicit
`roiSelector` to punch in on the same card. Selectors use Playwright's `:has-text()` because
concept cards have no IDs.

### `notVisible` rule — do not name a sidenav label

At 1440px the fixed `.page-sidenav` is on screen in **every** capture, and it contains the literal
strings `Matt Pocock's Workflow`, `LLM & Agent Foundations`, `How LLMs Actually Work`,
`Agentic Engineering`, `Agentic Development Principles` and `Multi-Agent Patterns`. Those six
strings are visible regardless of scroll position, so none of them can ever be a `notVisible`
assertion. Use a `.concept-name` title instead — card titles are not duplicated in the sidenav.

---

## 5. Slide specifications

11 slides. Card text is one or two sentences (enforced; overflow is a hard pixel-measured
failure). No bullets. Every card title needs an `icon` from the bundled Lucide set.

> **Pre-compile check:** an unknown icon name is a hard error. Validate every name below against
> the bundled set before the first `deck.mjs` run and substitute rather than debugging at render.

> **Narration/slide overlap warns above 70%.** Slide narration below deliberately says what the
> cards do not.

### Cold open

**S01 · `statement`**
- title: `It was confident. It was also wrong.`

**S02 · `tiled`** — 3 cards, short even labels (rule 7)
- title: `Three ways AI coding fails`
- cards: `Ambiguity` (icon `circle-help`, text: The requirement had two readings and nobody chose one.) · `Intent drift` (icon `git-branch`, text: The code stopped matching what was asked for.) · `Handoff quality` (icon `package`, text: The next step inherited something it could not use.)
- Provenance: this triad comes from Track A's "Why Matt Pocock's framework?" box ("ambiguity, intent drift, and poor handoff quality"), not from Track B. It is used as cold-open framing only and is never taught.

**S03 · `hero`** — 0 cards, `pill: Prerequisites`
- title: `LLM and Agent Foundations`

### The six diagrams

**D1 · S06 · `stat-deepdive`** — forced by structural rule 2; the only layout with a `stat` slot
- title: `The window is a budget`
- stat: `{ value: '40', unit: '%', label: 'of the limit before reasoning degrades' }` — **object, not a scalar.** `deck-html.mjs` reads `stat.value`, `stat.unit` and `stat.label`; a bare `40%` compiles to `value: undefined`.
- cards: `Smart Zone` (icon `gauge`, text: Reasoning stays reliable here.) · `Dumb Zone` (icon `trending-down`, text: Past the boundary, reasoning quality degrades.) · `Lost in the middle` (icon `search`, text: Content buried mid-window is recalled least accurately.)

**D2 · S09 · `bento-a`** — 3 cards, one dominant (rule 8). **External first**: the dominant slot is positional.
- title: `Three stores, three lifetimes`
- cards: `External` (icon `git-branch`, text: Files, version control and issue trackers. Survives every session.) · `In-context` (icon `message-square`, text: The current prompt and conversation. Gone after the call.) · `Parametric` (icon `cpu`, text: Trained weights. Fixed and unchangeable.)

**D3 · S25 · `lifecycle`** — 4 chronological phases on a rail (rule 6)
- title: `Reason, act, observe, exit`
- cards: `Reason` (icon `brain`, detail `Phase 1`, text: Decide what to do next.) · `Act` (icon `play`, detail `Phase 2`, text: Call a tool, write code, run a command.) · `Observe` (icon `eye`, detail `Phase 3`, text: Read the result and feed it back.) · `Exit` (icon `check`, detail `Convergence`, text: Without this the loop has no signal to stop.)
- Known limitation: no layout draws a return arrow. Loop closure is carried by the `Exit` card text and the narration.

**D4 · S22 · `comparison`** — forced by structural rule 4; the only two-card layout
- title: `Retrieve, or act`
- cards: `RAG` (icon `database`, text: Retrieval before generation. Fetches information to ground the answer.) · `MCP` (icon `plug`, text: A protocol for reaching tools. It reads systems, and can also act on them.)
- The axis is deliberately **not** freshness. RAG retrieves at request time and can query a live database; see appendix item 8.

**D5 · S28 · `process-flow`** — 5 cards, and rule 4 makes this the only layout that accepts five
- title: `QRSPI`
- cards: `Questions` (icon `circle-help`) · `Research` (icon `search`) · `Structure` (icon `layers`) · `Plan` (icon `list-checks`) · `Implement` (icon `code`, text: The first four finish before this one starts.)
- The three interleaving failure modes stay off this slide. The page already lists them as a `<ul>` inside the Planning-Execution Separation card, so the page carries them and the slide carries only the geometry. This is what keeps the count at six.

**D6 · S45 · `spotlight`** — 4 cards, orchestrator clearly heaviest (rule 8). Semantically right: the hierarchy is the concept.
- title: `Who knows what`
- cards: `Orchestrator` (icon `network`, text: Sequences work and routes blockers. Never reads files.) · `Subagent` (icon `box`, text: Clean context, restricted tools, one bounded task.) · `Reviewer` (icon `user-check`, text: Sees the output and the specification, nothing else.) · `In parallel` (icon `zap`, text: Independent tasks run at once, on models suited to each.)

### Closing

**S53 · `tiled`** — 4 cards, even weight (rule 9)
- title: `What the four topics establish`
- cards: `Limits` (icon `gauge`, text: The window, the memory model, and the two failure modes.) · `Engineering` (icon `wrench`, text: What goes into the window, and when.) · `Discipline` (icon `shield-check`, text: Specification, tests, records, and gates.) · `Division` (icon `network`, text: How work and context split across agents.)

**S54 · `statement`**
- title: `Structure does the work, not the model.`

---

## 6. Scene table

Format per scene: id · type · beat, then capture spec, then verbatim narration.
Chapter cards ride on the first capture scene of each topic via `overlay: chapter` — free, and no
extra scene.

`assert.visible` is required on every capture. It is the only check that catches a wrong-content
capture; `ffprobe` and `blackdetect` cannot see a wrong scroll position.

---

### Cold open (~70s)

**S01 · slide · statement** — ~14s
> You gave an agent a clear instruction. It produced something confident, complete, and wrong. Not broken code that failed loudly. Working code that solved the wrong problem.

**S02 · slide · tiled** — ~22s
> AI coding fails in three ways, and none of them are about the model being weak. The requirement was ambiguous and the agent guessed. The code drifted from the intent while everyone watched. Or the handoff to the next step carried something unusable. Every rule you are about to learn exists to prevent one of these.

**S03 · slide · hero** — ~13s
> This is Track B of the prerequisites: the large language model and agent concepts underneath the workflow. Four topics. The goal is not to use the workflow. It is to understand why each part of it is shaped the way it is.

**S04 · capture · establishing** — ~24s
- url `/index.html`
- steps: `waitForText "Foundations of Agentic Engineering"`
- assert.visible: `["Foundations of Agentic Engineering", "LLM & Agent Foundations"]`
- assert.notVisible: `["Something went wrong"]`
> The prerequisites page has two tracks. Track A is the workflow itself, covered elsewhere. We are working through Track B, the four topics below it. Everything discussed here is on this page, so you can follow along and come back to it.

---

### Topic 1 · How LLMs Actually Work (~3m 20s)

#### 1.1 Context Windows, Smart Zone / Dumb Zone, Lost in the Middle

**S05 · capture · anchor + mechanism** — `overlay: chapter` → title `Topic 1`, description `How LLMs Actually Work` — ~34s
- url `/index.html#phase-llms`
- steps: `scroll delta 120` → `highlight text "Context Windows, Smart Zone"` delayMs 2500
- assert.visible: `["How LLMs Actually Work", "Smart Zone"]`
- assert.notVisible: `["Orchestrator-Worker Architecture"]`
> The context window is everything the model can see in one call: your prompt, the instructions, the code, the conversation so far. The page makes two claims about it. Models perform reliably up to roughly forty percent of their context limit — the Smart Zone. Past that they enter the Dumb Zone, where reasoning quality degrades. And within any window, content buried in the middle is recalled less accurately than content at the start or end. That is the Lost in the Middle effect.

**S06 · slide · D1 stat-deepdive** — ~22s
> Two different problems share one picture. The zones are about volume: how much you have put in. Lost in the middle is about position: where you put it. A window can be comfortably inside the Smart Zone and still lose a fact you buried halfway down.

**S07 · capture · failure + practice** — ~26s
- url `/index.html#phase-llms`
- steps: `scroll delta 120` → `highlight text "Lost in the Middle"` delayMs 2000
- roiSelector `.concept:has-text("Smart Zone")`
- assert.visible: `["Dumb Zone", "Lost in the Middle"]`
> You have felt this. An hour into a session the agent starts ignoring instructions it followed perfectly at the start. Nothing broke; the window filled. So two habits follow. Put critical instructions at the top, where attention is strongest. And when quality starts slipping, do not argue with the agent — start a fresh session and carry only what matters.

#### 1.2 LLM Memory Architecture

**S08 · capture · anchor + mechanism** — ~32s
- url `/index.html#phase-llms`
- steps: `scroll delta 420` → `highlight text "LLM Memory Architecture"` delayMs 2500
- assert.visible: `["LLM Memory Architecture", "parametric"]`
> Large language models have no persistent state between calls. There are three stores. In-context is the current prompt and conversation — ephemeral, lost between calls. External is durable: files, version control, issue trackers, artifacts that survive sessions. Parametric is the trained weights, fixed and unchangeable. The workflow relies on external memory as its durable backbone.

**S09 · slide · D2 bento-a** — ~22s
> Rank these by lifetime and the design falls out on its own. Weights you cannot change. Conversation you cannot keep. Which leaves exactly one place to put a decision you need honoured next week: the repository.

**S10 · capture · failure + practice** — ~26s
- url `/index.html#phase-llms`
- steps: `scroll delta 420` → `highlight text "external"` delayMs 2000
- roiSelector `.concept:has-text("LLM Memory Architecture")`
- assert.visible: `["in-context", "external"]`
> This is why a decision explained in chat is a decision you will explain again. Tomorrow's session starts blank, and the reasoning is gone. The practice: anything a future session must respect gets written to a file and committed. If it only exists in a conversation, treat it as already lost.

#### 1.3 Hallucination and Non-determinism

**S11 · capture · anchor + mechanism** — ~34s
- url `/index.html#phase-llms`
- steps: `scroll delta 700` → `highlight text "Hallucination and Non-determinism"` delayMs 2500
- assert.visible: `["Hallucination", "Non-determinism"]`
> Two distinct problems. Hallucination: models predict the most likely next token rather than verify facts, so they generate plausible, incorrect information with full confidence. The page is precise about this — it is a generation problem, not a placement problem. No amount of Smart Zone positioning prevents it. Non-determinism: identical inputs produce different outputs across runs.

**S12 · capture · failure + practice + misconception** — ~30s
- url `/index.html#phase-llms`
- steps: `scroll delta 700` → `highlight text "Machine-verifiable tests"` delayMs 2000
- roiSelector `.concept:has-text("Hallucination")`
- assert.visible: `["human review", "convergence signal"]`
> Note the misconception this kills. Better placement fixes attention, not truthfulness. A perfectly positioned reference document does not stop a confident invention. The safeguards are human review and automated tests. And because the same prompt can give you a different answer next run, "it looks right" is not evidence. Machine-verifiable tests are the only reliable convergence signal.

---

### Topic 2 · Agentic Engineering (~7m 30s)

#### 2.1 Prompt Engineering

**S13 · capture · anchor + mechanism** — `overlay: chapter` → title `Topic 2`, description `Agentic Engineering` — ~32s
- url `/index.html#phase-engineering`
- steps: `scroll delta 100` → `highlight text "Prompt Engineering"` delayMs 2500
- assert.visible: `["Agentic Engineering", "Prompt Engineering", "role framing"]`
- assert.notVisible: `["Parallel Execution and Specialization"]`
> Prompt engineering is writing clear instructions for a single call. Four techniques. Role framing sets the agent's expertise and perspective. Positive framing describes the target behaviour rather than what to avoid — because the model predicts tokens toward whatever pattern you surface. Chain-of-thought elicitation asks it to reason step by step. And explicit completion criteria define what done means.

**S14 · capture · failure + practice** — ~24s
- url `/index.html#phase-engineering`
- steps: `scroll delta 100` → `highlight text "positive framing"` delayMs 2000
- roiSelector `.concept:has-text("Prompt Engineering")`
- assert.visible: `["chain-of-thought", "completion criteria"]`
> Positive framing is the one that feels wrong and matters most. "Never use `any`" puts `any` in front of the model. "Always write typed interfaces" gives it a target. Write what you want, not what you fear. And state completion criteria explicitly, because an agent with no definition of done will invent one.

#### 2.2 Context Engineering

**S15 · capture · anchor + mechanism** — ~28s
- url `/index.html#phase-engineering`
- steps: `scroll delta 380` → `highlight text "Context Engineering"` delayMs 2500
- assert.visible: `["Context Engineering", "Context rot"]`
> Prompt engineering is about how you phrase instructions. Context engineering is about what information is in the window at every step. The failure mode has a name: context rot, the silent degradation of recall as the window fills — before it is full. The design principle is one line. Pre-load only what is always needed, and retrieve everything else just-in-time.

**S16 · capture · failure + practice** — ~24s
- url `/index.html#phase-engineering`
- steps: `scroll delta 380` → `highlight text "just-in-time"` delayMs 2000
- roiSelector `.concept:has-text("Context rot")`
- assert.visible: `["pre-load", "just-in-time"]`
> The tempting move is to load every framework guide and coding standard up front so the agent always has them. That spends the capacity the task needs, and degrades recall across everything else in the window. Silently — there is no warning. Load what is always needed. Fetch the rest when it is needed.

#### 2.3 Retrieval-Augmented Generation

**S17 · capture · anchor + mechanism** — ~28s
- url `/index.html#phase-engineering`
- steps: `scroll delta 640` → `highlight text "Retrieval-Augmented Generation"` delayMs 2500
- assert.visible: `["Retrieval-Augmented Generation", "chunked"]`
> Retrieval-augmented generation, RAG, is the mechanism behind just-in-time retrieval. Source documents are chunked, indexed, and searched on each request — semantic, keyword, or hybrid. The most relevant chunks get injected into the window at the moment they are needed, instead of everything being pre-loaded.

**S18 · capture · failure + practice** — ~22s
- url `/index.html#phase-engineering`
- steps: `scroll delta 640` → `highlight text "just-in-time"` delayMs 2000
- roiSelector `.concept:has-text("Retrieval-Augmented Generation")`
- assert.visible: `["semantic", "hybrid"]`
> This is the difference between a reference library and a stack of books on your desk. You are not reading less; you are holding less at once. In practice: when a knowledge base exists, query it. Pasting the document in defeats the point.

#### 2.4 Open Knowledge Format

**S19 · capture · anchor + mechanism** — ~32s
- url `/index.html#phase-engineering`
- steps: `scroll delta 900` → `highlight text "Open Knowledge Format"` delayMs 2500
- assert.visible: `["Open Knowledge Format", "typed entities"]`
> Open Knowledge Format is a structured knowledge representation that makes retrieval more precise than raw document chunks. Andrej Karpathy argued that conventional RAG retrieves noisy, unstructured text fragments. Hybrid search helps you find the right chunk, but the chunk itself may still carry irrelevant surrounding text. OKF addresses that at the representation level, organising knowledge as typed entities and relationships.

**S20 · capture · failure + practice** — ~22s
- url `/index.html#phase-engineering`
- steps: `scroll delta 900` → `highlight text "specific fact"` delayMs 2000
- roiSelector `.concept:has-text("Open Knowledge Format")`
- assert.visible: `["typed entities", "specific fact"]`
> The shift is in the unit of retrieval. With chunks you get a paragraph and hope the fact is in it. With structured knowledge you get the fact. Same search, less noise arriving with the answer.

#### 2.5 Model Context Protocol

**S21 · capture · anchor + mechanism** — ~26s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1160` → `highlight text "Model Context Protocol"` delayMs 2500
- assert.visible: `["Model Context Protocol", "external tools"]`
> Model Context Protocol, MCP, is an open protocol for connecting models to external tools, data sources and services. Where RAG retrieves from a pre-indexed snapshot, MCP lets the agent query a tool's current state — reading file systems, calling APIs, querying databases — without custom integration per tool.

**S22 · slide · D4 comparison** — ~28s
> The dividing line is not freshness. RAG retrieves when you ask, so it can query a live database just as easily as a document store. What separates them is what the information is for. RAG retrieves, then generates: the fetch exists to ground the answer. MCP is a protocol for reaching other systems at all, and reading is only one of the things it does. It can also transact — call an endpoint, file a ticket, change state somewhere else. Retrieval grounds an answer; a transaction has a consequence. They are not competitors. They cover different areas of what an agent needs.

**S23 · capture · failure + practice** — ~22s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1160` → `highlight text "current state"` delayMs 2000
- roiSelector `.concept:has-text("Model Context Protocol")`
- assert.visible: `["querying databases", "current state"]`
> So ask two questions of whatever the agent needs. Does it need to know something? That is retrieval, and RAG covers it whether the source is a document store or a live database. Does it need to change something outside itself? That is a transaction, and no amount of retrieval will do it. Knowing which of the two you need is the whole decision.

#### 2.6 The ReAct Pattern and Agentic Loop Design

**S24 · capture · anchor + mechanism** — ~36s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1420` → `highlight text "The ReAct Pattern"` delayMs 2500
- assert.visible: `["ReAct Pattern", "convergence condition"]`
> This is the pattern that turns a single-shot model into a multi-step agent. Three phases. Reason: decide what to do next. Act: call a tool, write code, run a command. Observe: read the result and feed it into the next reasoning step. That observe-then-reason cycle is what lets an agent self-correct from real outcomes instead of guessing in one pass. And every loop needs a convergence condition telling it when to stop.

**S25 · slide · D3 lifecycle** — ~24s
> Watch what each lap costs. Every observation is added to the window, so a loop without an exit does two things at once: it never stops, and it degrades as it goes. By lap fifteen the agent is reasoning over mostly its own history.

**S26 · capture · failure + practice** — ~24s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1420` → `highlight text "all tests pass"` delayMs 2000
- roiSelector `.concept:has-text("ReAct Pattern")`
- assert.visible: `["Reason", "Observe", "convergence"]`
> You have seen the failure: an agent trying the same fix four times with slightly different wording. So define the exit before you start the loop. All tests pass. Zero must-fix findings. Something a machine can check — not your judgment of whether it looks finished.

#### 2.7 Planning-Execution Separation

**S27 · capture · anchor + mechanism** — ~34s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1700` → `highlight text "Planning-Execution Separation"` delayMs 2500
- assert.visible: `["Planning-Execution Separation", "Context overflow", "Plan narration"]`
> Complete all research, questioning and planning before writing any code. When the two are interleaved, the page names three failure modes. Context overflow: researching mid-task eats the tokens that should be writing code. Plan narration: the agent gets confused and describes what it would do instead of doing it. And late requirement changes: ambiguities surface mid-implementation and derail the session.

**S28 · slide · D5 process-flow** — ~24s
> In this workflow the practice has a name: QRSPI. The order is not the interesting part — the boundary is. Four steps finish completely, and only then does code get written. Everything ambiguous is resolved while resolving it is still cheap.

**S29 · capture · failure + practice** — ~24s
- url `/index.html#phase-engineering`
- steps: `scroll delta 1700` → `highlight text "QRSPI"` delayMs 2000
- roiSelector `.concept:has-text("Planning-Execution Separation")`
- assert.visible: `["QRSPI", "Late requirement changes"]`
> Plan narration is worth recognising, because it looks like progress. The agent produces a beautiful description of the change and no change. That is a context problem, not a comprehension problem. The practice: when you notice yourself researching during implementation, stop. You are in the wrong phase.

#### 2.8 Agent Skills

**S30 · capture · anchor + mechanism** — ~30s
- url `/index.html#phase-engineering`
- steps: `scroll delta 2020` → `highlight text "Agent Skills"` delayMs 2500
- assert.visible: `["Agent Skills", "SKILL.md", "Progressive disclosure"]`
> Agent skills are reusable capabilities packaged as `SKILL.md` files — instructions, scripts and resources, each invoked as a slash command. Progressive disclosure keeps the cost down: only each skill's name and one-line description load at startup. Full instructions load when the skill is actually invoked.

**S31 · capture · failure + practice** — ~24s
- url `/index.html#phase-engineering`
- steps: `scroll delta 2020` → `highlight text "progressive disclosure"` delayMs 2000
- roiSelector `.concept:has-text("Agent Skills")`
- assert.visible: `["slash command", "context footprint"]`
> This is the answer to an obvious objection. If every capability lived in the system prompt, thirty skills would leave no room for work. Descriptions at startup, instructions on demand — so adding skills does not tax every session. It is also how the Eitri skills extend this workflow without modifying its core.

---

### Topic 3 · Agentic Development Principles (~5m 40s)

#### 3.1 Human-in-the-Loop Design

**S32 · capture · anchor + mechanism** — `overlay: chapter` → title `Topic 3`, description `Agentic Development Principles` — ~32s
- url `/index.html#phase-principles`
- steps: `scroll delta 100` → `highlight text "Human-in-the-Loop"` delayMs 2500
- assert.visible: `["Agentic Development Principles", "Human-in-the-Loop"]`
- assert.notVisible: `["Subagents and Context Isolation"]`
> Agents do not pause when a requirement is ambiguous. They guess, confidently. So human review goes at defined checkpoints where decisions need judgment — scope changes, compliance sign-off. Let the system self-correct only where the outcome is machine-verifiable: syntax errors, test failures. And the page is blunt about the rest: a gate that can be bypassed, even accidentally, is not a gate.

**S33 · capture · failure + practice** — ~24s
- url `/index.html#phase-principles`
- steps: `scroll delta 100` → `highlight text "not a gate"` delayMs 2000
- roiSelector `.concept:has-text("Human-in-the-Loop")`
- assert.visible: `["machine-verifiable", "not a gate"]`
> The test is simple. Can a machine decide this correctly? Then automate it and stay out of the way. Does it need judgment, or carry consequences a test cannot see? Then it is a gate, and a gate you can skip when you are in a hurry is decoration.

#### 3.2 Specification-First Development

**S34 · capture · anchor + mechanism** — ~32s
- url `/index.html#phase-principles`
- steps: `scroll delta 420` → `highlight text "Specification-First Development"` delayMs 2500
- assert.visible: `["Specification-First Development", "Behaviour Driven Development"]`
> A complete, unambiguous specification must exist before implementation begins, so the agent reads and implements rather than deriving requirements mid-loop. The page lists several approaches that differ in how the specification is expressed: behaviour-driven development uses human-readable scenarios, spec-driven development uses a formal document, structured-prompt-driven development uses structured prompts, and tools like Spec Kit and GSD supply templates and frameworks.

**S35 · capture · failure + practice** — ~28s
- url `/index.html#phase-principles`
- steps: `scroll delta 420` → `highlight text "lightweight and flexible"` delayMs 2000
- roiSelector `.concept:has-text("Specification-First Development")`
- assert.visible: `["Spec Kit", "plan.md"]`
> The page explains why this workflow was chosen over the heavier options. Spec Kit and GSD mandate directory structures, multi-file templates and dedicated command-line tools. This one is a folder of composable conversational skills. You invoke only what you need, the agent interviews you to extract requirements, and it generates a single plan document. Spec-first discipline, near-zero overhead, no lock-in.

#### 3.3 Test-Driven Development

**S36 · capture · anchor + mechanism** — ~28s
- url `/index.html#phase-principles`
- steps: `scroll delta 780` → `highlight text "Test-Driven Development"` delayMs 2500
- assert.visible: `["Test-Driven Development", "Red-Green-Refactor"]`
> TDD follows red, green, refactor. Write a failing test. Write the minimum code to pass it. Refactor without breaking it. In agentic work it does one more job: it supplies the machine-verifiable convergence signal. The loop exits when tests pass, not when output looks plausible.

**S37 · capture · failure + practice** — ~22s
- url `/index.html#phase-principles`
- steps: `scroll delta 780` → `highlight text "non-determinism"` delayMs 2000
- roiSelector `.concept:has-text("Test-Driven Development")`
- assert.visible: `["machine-verifiable", "tests pass"]`
> This connects back to Topic 1. Because the same prompt can produce different output next run, your own inspection is not a stable standard. Without tests there is no objective way to know the agent is done. With them, done is a fact.

#### 3.4 Architecture Decision Records

**S38 · capture · anchor + mechanism** — ~28s
- url `/index.html#phase-principles`
- steps: `scroll delta 1080` → `highlight text "Architecture Decision Records"` delayMs 2500
- assert.visible: `["Architecture Decision Records", "consequences"]`
> An ADR is a short document capturing a technical choice: context, decision, consequences. Because agents have no persistent memory between sessions, ADRs in version control act as their durable external memory. Without them, a future session has no way to know a past architectural choice was deliberate.

**S39 · capture · failure + practice** — ~24s
- url `/index.html#phase-principles`
- steps: `scroll delta 1080` → `highlight text "silently fix"` delayMs 2000
- roiSelector `.concept:has-text("Architecture Decision Records")`
- assert.visible: `["version control", "deliberate"]`
> Which produces a specific, maddening failure: a later session finds your deliberate choice, reads it as a mistake, and helpfully reverses it. The fix is to leave the reasoning where the next session will walk into it. In the repository, not in a chat log.

#### 3.5 Tracer Bullet Development

**S40 · capture · anchor + mechanism** — ~30s
- url `/index.html#phase-principles`
- steps: `scroll delta 1400` → `highlight text "Tracer Bullet Development"` delayMs 2500
- assert.visible: `["Tracer Bullet Development", "vertically"]`
> A strategy for slicing work into tickets. Instead of building horizontal layers — the whole database schema first — work is sliced vertically: a thin, production-quality feature cutting through data, logic, interface and tests. It matters for agents because a horizontal slice cannot be demoed or tested end to end in isolation.

**S41 · capture · failure + practice** — ~22s
- url `/index.html#phase-principles`
- steps: `scroll delta 1400` → `highlight text "self-correction loop stalls"` delayMs 2000
- roiSelector `.concept:has-text("Tracer Bullet")`
- assert.visible: `["production-quality", "self-correction"]`
> Follow that through. If a slice cannot be fully tested, the agent cannot verify its own output, and the self-correction loop stalls. So a good ticket is not the smallest amount of work — it is the smallest amount of work that can prove itself.

#### 3.6 Living Documentation

**S42 · capture · anchor + mechanism** — ~28s
- url `/index.html#phase-principles`
- steps: `scroll delta 1720` → `highlight text "Living Documentation"` delayMs 2500
- assert.visible: `["Living Documentation", "system prompt"]`
> In traditional development, stale documentation is an annoyance. In agentic development it is a fatal bug. Agents treat your repository's documentation as their system prompt, and they will faithfully generate code that complies with whatever standards they read.

**S43 · capture · failure + practice** — ~24s
- url `/index.html#phase-principles`
- steps: `scroll delta 1720` → `highlight text "confidently produce wrong outputs"` delayMs 2000
- roiSelector `.concept:has-text("Living Documentation")`
- assert.visible: `["coding standards", "wrong outputs"]`
> So a coding standard you abandoned two years ago is not a historical note. It is an instruction, and it will be followed perfectly. Documentation in this model is closer to configuration than to prose: if it is wrong, the output is wrong, confidently.

---

### Topic 4 · Multi-Agent Patterns (~3m 40s)

#### 4.1 Orchestrator-Worker Architecture

**S44 · capture · anchor + mechanism** — `overlay: chapter` → title `Topic 4`, description `Multi-Agent Patterns` — ~26s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 100` → `highlight text "Orchestrator-Worker Architecture"` delayMs 2500
- assert.visible: `["Multi-Agent Patterns", "Orchestrator-Worker"]`
> The orchestrator coordinates. It sequences work and routes blockers, and it never reads files or makes implementation decisions. An orchestrator that does implementation work fills its context with detail and loses coordination accuracy.

**S45 · slide · D6 spotlight** — ~26s
> Every rule in this topic is the same rule applied four times: control what each agent knows. The orchestrator holds the plan and not the code. The subagent holds one task and not the plan. The reviewer holds the specification and the output and nothing about how the output came to exist.

**S46 · capture · failure + practice** — ~22s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 100` → `highlight text "coordination accuracy"` delayMs 2000
- roiSelector `.concept:has-text("Orchestrator-Worker")`
- assert.visible: `["coordinates", "implementation decisions"]`
> This is the same context budget from Topic 1, spent on the wrong thing. An orchestrator that starts reading source files trades the overview for detail, and the overview was its entire job. Coordination and implementation are different roles, and one agent cannot hold both well.

#### 4.2 Subagents and Context Isolation

**S47 · capture · anchor + mechanism** — ~24s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 380` → `highlight text "Subagents and Context Isolation"` delayMs 2500
- assert.visible: `["Subagents and Context Isolation", "clean context window"]`
> Each subagent starts with a clean context window, a restricted tool set, and a single bounded task. Isolation ensures a subagent reading files for one ticket cannot pollute the context of another.

**S48 · capture · failure + practice** — ~22s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 380` → `highlight text "pollute"` delayMs 2000
- roiSelector `.concept:has-text("Subagents and Context Isolation")`
- assert.visible: `["restricted tool set", "bounded task"]`
> Isolation is a feature, not a limitation. An agent that inherits everything receives coordination history, other tickets' details and unrelated decisions — and then reasons over all of it. Fresh context, one task, only the tools that task needs.

#### 4.3 Independent Review as Quality Architecture

**S49 · capture · anchor + mechanism** — ~26s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 640` → `highlight text "Independent Review"` delayMs 2500
- assert.visible: `["Independent Review", "original specification"]`
> When one agent reviews another's work, the reviewer gets only the final output and the original specification. If it inherits the implementing agent's conversation history, it becomes biased by the implementer's logic and ends up reviewing the reasoning rather than checking whether the code meets the spec.

**S50 · capture · failure + practice** — ~24s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 640` → `highlight text "biased by the implementer"` delayMs 2000
- roiSelector `.concept:has-text("Independent Review")`
- assert.visible: `["final output", "meets the spec"]`
> This has a human parallel. Sit through someone explaining why they built it that way and you will find yourself agreeing with the reasoning instead of reading the code. The explanation is persuasive; the specification is the standard. A reviewer with a clean context cannot be talked round.

#### 4.4 Parallel Execution and Specialization

**S51 · capture · anchor + mechanism** — ~24s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 900` → `highlight text "Parallel Execution"` delayMs 2500
- assert.visible: `["Parallel Execution", "simultaneously"]`
> Unlike a human team, an orchestrator can spawn multiple subagents for independent tasks simultaneously — five compliance checks at once, for example. Subagents can also be specialised, using different system prompts or cheaper models suited to their bounded task.

**S52 · capture · failure + practice** — ~24s
- url `/index.html#phase-multiagent`
- steps: `scroll delta 900` → `highlight text "optimizes both speed and cost"` delayMs 2000
- roiSelector `.concept:has-text("Parallel Execution")`
- assert.visible: `["specialized", "cheaper models"]`
> Two levers, and they compound. Parallelism cuts wall-clock time on anything genuinely independent. Specialisation routes simple bounded work to cheap fast models and saves the expensive reasoning for work that needs it. The judgment required is knowing which tasks are actually independent.

---

### Closing (~50s)

**S53 · slide · tiled** — ~28s
> Four topics, one argument. Topic 1 gave you the limits: a context window that degrades before it fills, three memory stores with three lifetimes, and two failure modes — confident invention and run-to-run variation. Topic 2 was engineering around those limits: what enters the window, when it is retrieved, how loops terminate, and why planning finishes before implementation starts. Topic 3 was the discipline that makes it verifiable: specifications before code, tests as the exit signal, records as external memory, vertical slices that can prove themselves, and documentation treated as configuration. Topic 4 was the division of labour: who knows what, and why a reviewer must not know how the code was written.

**S54 · slide · statement** — ~22s
> If one thing carries over, make it this. Nothing here depends on a better model. Every practice is a response to a measurable limit, every loop closes on a signal a machine can check, and every gate is placed where judgment is genuinely required. The structure does the work.

---

## 7. Chapter map

| Chapter | Rides on | Title | Description |
|---|---|---|---|
| 1 | S05 | `Topic 1` | How LLMs Actually Work |
| 2 | S13 | `Topic 2` | Agentic Engineering |
| 3 | S32 | `Topic 3` | Agentic Development Principles |
| 4 | S44 | `Topic 4` | Multi-Agent Patterns |

`overlay: chapter` uses `page.screencast.showChapter` over the live page with a blurred backdrop.
Free, and it does not escalate the engine to Remotion. Do not use `pip`.

---

## 8. Build

```bash
S=.kiro/skills/video-generator

# 1. capability probe first — author only what the report allows
node $S/scripts/bootstrap.mjs --workDir=video-generation --skip-install

# 2. install the project-local runtime (deleting .runtime/ uninstalls everything)
node $S/scripts/bootstrap.mjs --workDir=video-generation

# 3. author video-generation/storyline.yml from §3–§6 of this plan
#    author video-generation/setup/pin-light-theme.mjs from §4

# 4. slides first — no TTS, no server, no cost. Look at the PNGs.
node $S/scripts/compile.mjs --workDir=video-generation
node $S/scripts/deck.mjs    --workDir=video-generation --formats=png,pdf,html
open video-generation/assets/slides/

# 5. serve the docs site, then run the full pipeline and stop at the gate
npx --yes serve docs -l 4173 &
node $S/scripts/generate.mjs --workDir=video-generation --baseUrl=http://127.0.0.1:4173
```

Engine will resolve to FFmpeg: single aspect, no reframing, no kinetic captions, no PIP. That
keeps Remotion's licence condition off the path entirely.

### Acceptance criteria

1. `verify.mjs` reports PASS. A FAIL means do not ship.
2. Zero slide overflow. Do not pass `--allow-overflow`; fix the card text.
3. Every icon name resolved. An unknown name is a hard error by design.
4. All 43 capture assertions pass. A failed assertion aborts the run rather than skipping a scene.
5. Caption geometry checked by burning one cue over a solid frame (SKILL.md §Verification).
6. Body text legible when the 1920×1080 output is viewed at 50% scale. This is the whole reason
   for the 1440 viewport; if it fails, the viewport is wrong, not the font.
7. Narration-redundancy warnings reviewed. Warnings are acceptable on D1 (a stat slide should say
   its number); investigate any others.
8. Light theme in every frame. Any dark frame means `setupScript` did not run.
9. Runtime 20–25 minutes. Materially longer means narration drifted from this plan.

### Embed snippet

`docs/index.html` is not edited by this plan. Apply separately, inside the `#track-b` header block,
matching the Lesson 2 pattern:

```html
<video controls preload="metadata" style="width: 100%; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 8px;">
  <source src="videos/llm-agent-foundations.mp4" type="video/mp4">
</video>
```

---

## 9. Maintainer appendix — **not narrated**

Per decision 5 the video mirrors the page, including these. Recorded so the knowledge is not lost
if the page is ever revised. **None of this appears in the script.**

1. **"Roughly 40% of their context limit"** — unit problem. Attention cost tracks absolute tokens,
   not percentage fill. A 1M-context model at 40% has spent 400K tokens and is well into
   degradation; a 200K model at 40% has spent 80K and is fine. The heuristic holds at 200K class
   and misleads above it.
2. **Lost in the Middle cited beside the 40% claim.** Liu et al. (TACL 2023) measured
   multi-document QA and key-value retrieval, finding accuracy highest when *relevant* information
   sits at the start or end. It says nothing about 40%, and it is about needle retrieval, not
   general reasoning decay. Two phenomena, two sources.
3. **Non-determinism attributed solely to stochastic sampling.** Variation persists at temperature
   zero: batched inference and floating-point non-associativity change results, and
   mixture-of-experts routing depends on batch composition. "Set temperature to 0" is not a fix.
4. **"LLMs have no persistent state between calls."** True of the model, not of the product. Kiro,
   Claude Code and Cursor layer compaction, memory files and session resumption on top. Learners
   will hit this contradiction on day one.
5. **OKF positioned as the answer to Karpathy's RAG critique.** Karpathy's gist criticises noisy
   chunk retrieval; Open Knowledge Format as cited is a Google Cloud data-sharing format. The
   underlying principle is sound; the implied lineage is not.
6. **ADRs described as three fields.** Nygard's template is title, status, date, context, decision,
   consequences. `status` is load-bearing for the exact failure the card describes — a superseded
   decision an agent re-applies because nothing marked it dead.
7. **`/grill-me` versus `/grill-with-docs`.** Topic 3's prose says `/grill-me`; Track A's flow says
   `/grill-with-docs`. One is wrong, and Topic 3 is in scope. Narration mirrors whichever card is
   on screen.
8. **"Where RAG retrieves from a pre-indexed snapshot, MCP lets the agent query their current
   state."** This is the one place the video **deviates** from the page, on the owner's explicit
   instruction. The page implies the axis between RAG and MCP is freshness, and it is not. RAG
   retrieves at request time and can query a live database as readily as a static document store;
   the "pre-indexed" part is an implementation choice, not a property of RAG. The real distinction
   is purpose: RAG is retrieval *before* generation, fetching information to ground an answer,
   whereas MCP is a protocol for reaching external systems at all — reading is only one of its
   uses, and it equally covers state-changing transactions such as calling an endpoint or filing a
   ticket. Retrieval grounds an answer; a transaction has a consequence. **Handling:** S21 (the
   Anchor beat) still mirrors the page's wording, and S22 and S23 teach the correct axis without
   contradicting S21 head-on — S22 opens by naming freshness as the wrong dividing line. If the
   page is ever revised, revise it here.

---

## 10. Open risks

| Risk | Handling |
|---|---|
| `scroll` deltas are relative mouse-wheel pixels and every value in §6 is an estimate. | Tune in one dry capture pass, then commit. Per-scene fresh contexts and anchor URLs keep each delta independent, so a bad value breaks one scene. |
| Lucide icon names are a hard error at render. | Validate all names in §5 before the first `deck.mjs` run. |
| 1440→1920 upscale softens text slightly. | Accepted: legibility beats sharpness for a reading-heavy video. Revisit only if `deviceScaleFactor` becomes configurable. |
| Page copy changes invalidate `assert.visible` strings and highlight targets. | Assertions fail loudly and abort, which is the intended behaviour. Re-pin strings when Track B is edited. |
| Kokoro prosody may be flat across 22 minutes. | `--tts` is a one-flag change; re-runs synthesis and composition only, never capture. |
| Voice may not match the nine existing lesson videos. | Unverified — their engine is unknown. Compare before publishing and re-synthesise if it jars. |
| A dirty git tree counts as its own `appVersion` and forces re-capture. | Commit or stash before capture. |

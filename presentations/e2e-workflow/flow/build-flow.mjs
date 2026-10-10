/**
 * Builds flow/index.html: the /e2e skill's workflow.dot rendered as inline SVG.
 *
 * Why SVG instead of the skill's workflow.png: `highlight` resolves a DOM
 * element and draws the overlay at its bounding box. A PNG has no DOM, so every
 * highlight would be a hand-measured pixel rectangle that silently drifts if the
 * diagram changes. Graphviz SVG gives every node a <g class="node"> group; this
 * script tags each one `id="n-<dot-id>"`, so a capture step can target
 * `#n-analyze` and the box follows the node by construction.
 *
 * Inputs : flow/workflow.dot   (copied verbatim from skills/e2e/references/)
 * Outputs: flow/workflow.svg, flow/index.html  (both committed; regenerate with)
 *
 *   npm install --prefix "$env:TEMP\vizjs" @viz-js/viz@3.11.0
 *   $env:NODE_PATH = "$env:TEMP\vizjs\node_modules"; node presentations/e2e-workflow/flow/build-flow.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { instance } = require('@viz-js/viz');
const dir = import.meta.dirname;

/**
 * Smooth pan between diagram sections. The skill's `scroll` step is a single
 * mouse.wheel event, which Chromium applies as an instant jump. This page
 * intercepts the wheel and eases to the same destination instead, so a scene
 * can open where the previous one ended and glide down to its own section.
 * Duration depends only on distance (never on wall-clock speed), so the
 * storyline can budget it: dur = clamp(600 + 0.7 * px, 800, 1700) ms.
 * Uses rAF frame timestamps, so the pan length depends only on distance.
 */
const PAN_SCRIPT = `(() => {
  let target = null, frame = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  addEventListener('wheel', (e) => {
    e.preventDefault();
    const from = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const to = Math.max(0, Math.min(max, (target ?? from) + e.deltaY));
    target = to;
    const dur = Math.min(1700, Math.max(800, 600 + Math.abs(to - from) * 0.7));
    cancelAnimationFrame(frame);
    let t0 = null;
    const step = (now) => {
      t0 ??= now;
      const p = Math.min(1, (now - t0) / dur);
      scrollTo(0, from + (to - from) * ease(p));
      if (p < 1) frame = requestAnimationFrame(step); else target = null;
    };
    frame = requestAnimationFrame(step);
  }, { passive: false });
})();`;

const viz = await instance();
let svg = viz.renderString(readFileSync(path.join(dir, 'workflow.dot'), 'utf8'), { format: 'svg' });
writeFileSync(path.join(dir, 'workflow.svg'), svg);

// Drop the XML prolog/doctype so the SVG can sit inline in HTML.
svg = svg.slice(svg.indexOf('<svg'));
// Tag each node group with a stable id taken from its <title> (the dot node id).
svg = svg.replace(/<g id="node\d+" class="node">\s*<title>([^<]+)<\/title>/g,
  (_, name) => `<g id="n-${name}" class="node">\n<title>${name}</title>`);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Story E2E campaign workflow</title>
<style>
  html, body { margin: 0; background: #f8fafc; }
  body { font-family: "Segoe UI", Inter, system-ui, sans-serif; color: #0f172a; }
  header { text-align: center; padding: 40px 0 8px; }
  header .eyebrow { font-size: 18px; letter-spacing: .12em; text-transform: uppercase; color: #2563eb; font-weight: 700; }
  header h1 { margin: 6px 0 0; font-size: 34px; font-weight: 800; }
  main { display: flex; justify-content: center; padding: 16px 0 360px; }
  svg { display: block; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;
        box-shadow: 0 4px 16px rgba(15,23,42,.06); }
  /* Scroll anchors: a capture URL ending #y1500 loads already scrolled to
     document y=1500, i.e. exactly where the previous flowchart scene ended its
     pan, so consecutive scenes join without a jump. Each offset puts every node
     a scene highlights between y=0 and y=880 of a 1080 viewport, clear of the
     caption band. */
  .anchor { position: absolute; left: 0; width: 1px; height: 1px; }
</style>
</head>
<body>
<header>
  <div class="eyebrow">/e2e · references/workflow.md</div>
  <h1>Story E2E campaign workflow</h1>
</header>
<main>
${svg}
</main>
${[680, 1500, 1900, 3300].map((y) => `<div class="anchor" id="y${y}" style="top:${y}px"></div>`).join('\n')}
<script>
${PAN_SCRIPT}
</script>
</body>
</html>
`;
writeFileSync(path.join(dir, 'index.html'), html);
console.log('wrote flow/workflow.svg and flow/index.html');

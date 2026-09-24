/**
 * Pre-bootstrap determinism hook for every capture in this presentation.
 *
 * Two jobs:
 *
 * 1. Pin the light theme before the page reads localStorage, so the capture does
 *    not depend on whatever theme the last human visit left behind.
 *
 * 2. Abort requests for the embedded walkthrough video. The prerequisites page
 *    embeds `videos/llm-agent-foundations.mp4` — a 63MB copy of the very video
 *    this pipeline produces — at y=3614..4057. Chromium spends ~15s pulling it
 *    before aborting, on each of the 43 fresh browser contexts (a context per
 *    scene means nothing is cached), which is ~2.7GB of pointless local I/O.
 *    That download is also what made captures flaky: it competes with the ffmpeg
 *    encode for I/O, delaying the page's own CSS and images, and a page whose
 *    stylesheet has not landed has zero-height containers — so Playwright
 *    correctly reports asserted text as "not visible", at a different scene each
 *    run. Aborting it takes `networkidle` from 15.7s to 0.7s.
 *
 *    The element has no `poster` and already paints on `background: #111827`, so
 *    it renders as the same dark rectangle either way. Only s04 has it in frame
 *    at all; every `#phase-*` capture sits below it.
 */
export default async ({ page, context }) => {
  await page.addInitScript(() => localStorage.setItem('eitri-theme', 'light'));
  await context.route(/\.(mp4|webm|mov)(\?.*)?$/i, (route) => route.abort());
};

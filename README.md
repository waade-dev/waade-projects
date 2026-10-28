# Waade — A collection of curiosity

Amith Athreya’s public project notebook. Plain HTML, CSS, and JavaScript; no build step or frontend dependencies.

The explorer combines a curved 3D project wheel, a rotating procedural branch, a particle torus knot, animated project illustrations, and a pointer-following observer. Small screens use a swipeable, snapping card strip with previous/next buttons. The reading pane contains the selected project’s description and original website link.

## Run locally

From this directory:

```sh
python3 -m http.server 4174
```

Open http://localhost:4174. Serve over HTTP so the browser can fetch `projects.json`.

## Explore

- Scroll over the desktop explorer with a trackpad or mouse wheel, or drag the cards up and down. Movement follows every input, glides briefly, and gently snaps to the nearest project. Details change only when the dial settles. Clicking a card, the previous/next buttons, and ↑/↓ also work. Enter focuses the selected content.
- On mobile, swipe between cards or use the buttons.
- Click **Search** in the header or press `/` to open the hidden search dialog. Escape, the close button, or clicking outside closes it. Search includes project names, descriptions, categories, and IDs.
- Commands: `projects` / `ls`, `about` / `whoami`, `next`, `prev`, `random`, `help`, and `cd <project-id>`.
- Palette commands: `theme carbon`, `theme moss`, and `theme paper`.
- Motion commands: `motion off` / `motion on`, and `tree off` / `tree on`.
- The footer provides the same palette and motion controls. Preferences stay in the current browser. System reduced-motion preferences always take priority; animations pause while the page is hidden.
- Every selected view has a shareable hash URL, such as `/#polylume` or `/#projects`. Browser Back and Forward restore the selected view.

## Update the collection

The header figurine is a transparent, optimized WebP at `assets/tanya-figurine.webp`. Its responsive sizes are defined by `.identity-figurine` in `style.css`; keep its empty alt text because it decorates the already-labeled home link.

Edit `projects.json`. Each entry has `id`, `name`, `category`, `description`, `url`, `label`, `art`, and `number`. Use a unique URL-safe ID and an HTTPS destination. Available illustrations: `papers`, `blueprint`, `space`, `library`, `atlas`, `profile`, `skills`, and `durable`. The optional `access` field labels destinations requiring sign-in.

The wheel, count, search, and project directory update from the catalog automatically. Keep the no-JavaScript fallback links in `index.html` in sync when changing the collection. No API key or private account data is required. The motion graphics are drawn locally; the observer does not send pointer data anywhere.

## Deploy

Use the existing `waade-projects` Vercel project with the **Other** framework preset. There are no install or build commands. Serve this directory as the project root and retain `vercel.json`. Include `pi-durable/` when deploying so existing guide URLs remain available.

## Verification

The redesign was checked in the browser for all seven project selections and destination URLs, category filtering, search matches and empty results, keyboard navigation, palette and motion preference persistence, and desktop/mobile layouts. JavaScript syntax was checked with `node --check app.js`. The dial’s input, inertia, wraparound, and frame-rate behavior are covered by `node --test tests/dial.test.mjs`.

## Pi Durable field guide

`/pi-durable/` is a standalone educational explainer with three deterministic crash scenarios, an architecture explorer, and hosting comparisons. It makes no model or external tool calls. The journal and PR are simulated. Official sources are linked on the page; recheck them when updating the beta integration details.

Its ordered, deferred classic scripts also work when `pi-durable/index.html` is opened directly from disk. Its asset and home links are relative. Run its loader and recovery regression checks with:

```sh
node --test tests/pi-durable.test.cjs
```

# Design pass · Codex · marketing site

---

## RYAN'S APPROVALS — Phase B starts here

Read this block first. Everything below it is the original design pass; this block is the canonical decision sheet. Where this block contradicts the body, this block wins. **Any proposal in the body NOT explicitly addressed below is APPROVED as written. You have design authority during the port — ship every approved `improvement`, document every deviation in `DESIGN-DECISIONS.md`.**

### Open questions (§10) — answers

1. **Hero headline on `/`:** **APPROVED — A. Loud: `Uoink that shit.`** The verb is the brand's strongest asset; the homepage is where it earns its keep. Ship the loud version on `uoink.video/`. The CWS-safe fallback `Uoink any video. Read it like a doc.` stays in the Tweaks panel as a flippable variant.
2. **Tweaks panel:** **APPROVED — A. Remove entirely from production for v3.1 launch.** Keep the JSX in the repo for v3.2; don't ship the React + Babel dev bundle to public users.
3. **Mac waitlist:** **APPROVED — A. Keep "Follow GitHub Discussions"** for v3.1. Don't add an email collector — adds GDPR scope and a mailbox you don't need yet. Revisit when Mac actually ships.
4. **`/llms.txt`:** **APPROVED — A. Ship at launch.** Plain-text canonical URLs + one-paragraph product description. Also ship `/llms-full.txt` per your §9 idea — it's the same data with more context, low cost.
5. **Installer filename:** **APPROVED — A. Use `Uoink-Setup-2.1.0.exe`.** (NOT `2.0.0` — Claude Code is shipping v2.1, your prototype was stale.) Update every reference in the site to `Uoink-Setup-2.1.0.exe`.
6. **Domain canonical:** **APPROVED — A. `uoink.video`.** No subpath, no ryanbiddy.com redirects in the site copy. Hard-link uoink.video everywhere.
7. **Profanity placement:** **APPROVED — A. Loud on homepage, safe in CWS/listings.** `Uoink that shit.` on `uoink.video/`. CWS title + description, README, store-listing all use the safe variant. Coordinate with Claude Code (their store-listing rewrite is on the safe variant — confirmed).
8. **Product status copy:** **APPROVED — A. Keep "Mac v2.1 in queue" throughout.** Roadmap signals are trust-building, not anxiety. Don't bury them on /install only.

### Improvements (§9) — all APPROVED

- **APPROVED — Full production `<head>`** (canonical, OG, Twitter, manifest, apple icon, PNG favicons, mask icon, theme color).
- **APPROVED — Remove the React/Babel Tweaks panel** from production (per Q2).
- **APPROVED — Mobile overflow fix pass** (`min-width:0`, pre/code wrapping, nav breakpoint, H1 clamps, 44 px touch targets).
- **APPROVED — Accessible nav behavior** (aria-expanded, aria-controls, Escape close, focus trap, focus return, branded `:focus-visible`).
- **APPROVED — `prefers-reduced-motion` support** for corpus animations and hover transforms.
- **APPROVED — Normalize brand tokens** (rust primary, vermillion sparse, acid solid-shapes only).
- **APPROVED — Add real H1 to `agent-docs.html`** ("Uoink agent docs.").
- **APPROVED — Self-host fonts** (Inter, Inter italic, Bungee, JetBrains Mono) with `font-display:swap`. Preload Bungee since it's the wordmark.
- **APPROVED — Generate separate social assets:** OG 1200×630 + GitHub 1280×640 (use the verbatim proposed render in your §7).
- **APPROVED — Convert nav/footer/head to shared components** during the port.

### Ideas (§9) — explicit yes/no

- **APPROVED — Build `/installed` route.** Claude Code's installer will auto-launch this URL once after install completes. Simple page: "Hello from Uoink ★ — Here's what to try first." Three or four cards: open YouTube → click the rust U → check the popup → paste into Claude. Coordinate URL with Claude Code (`https://uoink.video/installed`).
- **APPROVED — `/llms.txt` and `/llms-full.txt`.** (Per Q4 above.)
- **APPROVED — Config snippet generator for `/agents`.** Switches between Claude Desktop, Cursor, Continue, Cline, generic stdio. Genuinely useful for the agent-developer audience.
- **DEFERRED — "See a real corpus" interactive preview page.** Good idea but adds scope. Queue for v3.2.
- **DEFERRED — "Field manual" index page.** Same — post-launch.

### v3.1 brand violations — implement ALL fixes from §1 during the port

Every violation in §1 is APPROVED for fix. Critical ones to call out so they don't slip:
- Replace the inline data-URI favicon with the v3.1 SVG + PNG fallbacks + mask-icon.
- Change `manifest.webmanifest` `theme_color` from `#FF3D00` to `#C2410C` (rust) for branded install chrome.
- Fix every acid-as-type instance: `.ticker .star`, `.corpus .ln.hl`, `.mcp-log .arg`, `.docs-main pre .s`, `.block-tile h2 em`.
- Remove the `.tips-vermillion` small-tip override.
- Demote vermillion from default hover/active/label/code/CTA/footer/heading accent to ~5% accent: rust primary, vermillion only for CTAs + hover + one hero italic.
- Replace `var(--vermillion-deep)` in `privacy.html` with `--rust-deep` or `--oxblood`.

### Microcopy rewrites — all APPROVED

Apply every rewrite in §8 verbatim. Two notes:
- `Yoink-Setup-2.0.0.exe` references → `Uoink-Setup-2.1.0.exe` (NOT 2.0.0 — per Q5).
- Keep "Two seconds." in `agents.html:assistant demo` IF the real extraction is fast enough to justify the claim. If not, use your proposed softening ("I'll pull the corpus, then search the local index."). Default to soften if uncertain.

### Accessibility — all APPROVED for fix

Ship every fix in §4. Hard targets:
- Every interactive control ≥ 44×44 px on mobile.
- `:focus-visible` ring on every focusable element — use `outline: 2px solid var(--vermillion); outline-offset: 2px`.
- Mobile menu: `aria-expanded`, `aria-controls`, Escape closes, focus trap.
- All decorative `<uoink-mark>` instances get `aria-hidden="true"`. Brand link wrapper carries `aria-label="Uoink home"`.
- Muted warm `#7A7569` text: replace with parchment on dark, or bump to ≥14 px / bold to clear AA.

### Mobile overflow — ship the pass

Five pages currently overflow at 375 px (max 273 px on creators.html). Apply the full §3 fix pass: `min-width:0` on grid/flex children, `overflow-wrap:anywhere` on code/path examples, nav burger breakpoint raised to ~820-900 px, mobile H1 clamps, 44 px CTAs.

### Must-do before declaring done

1. **Lighthouse ≥ 95** across Perf / A11y / Best / SEO on the homepage, mobile AND desktop. If any score below 95, fix before merging.
2. **Test OG image** in Facebook debugger + Twitter card validator + LinkedIn post inspector + Slack unfurl. Pass on all four before going live.
3. **Test favicons** in Chrome (light + dark tab), Safari pinned tab, iOS home screen add-to-home-screen, Android home screen, Windows Start Menu PWA. All must read clearly.
4. **DNS swap pause** — deploy to `*.vercel.app` first, ping Ryan for sign-off, THEN point `uoink.video`. Don't surprise-deploy.
5. PR description / `DESIGN-DECISIONS.md` lists every deviation from the prototype, one line each.

---

## Summary

The prototype is much stronger than a normal static handoff: the pages share a recognizable visual language, the wordmark system mostly survives across scales, and the v3.1 legibility patch is visible in the move away from serifs and into Inter-led layouts. The biggest brand miss is not one page, it is system drift: vermillion and acid are still used like general text colors, while v3.1 says rust is primary and acid is a solid-shape-only accent. The biggest accessibility risk is mobile: at 375 px, five of eight pages create horizontal overflow and the global nav controls miss the 44 px touch-target floor. The biggest performance risk is the homepage shipping a live React development + Babel tweaks panel and no production font-loading strategy.

Evidence gathered in a real browser at 1440, 768, and 375 px for all eight pages. Contact sheets were saved locally in `%TEMP%\uoink-design-pass\`, and browser metrics were captured from headless Chrome.

Counts in this pass:
- 29 v3.1 violations or grouped violations.
- 12 accessibility findings.
- 18 microcopy rewrites.
- 8 open questions.

## 1 · Brand v3.1 compliance (per page)

### Global system violations

- `site/*.html:head link[rel="icon"]` — current inline data favicon uses vermillion body `#FF3D00` and acid tips `#FFD23F` at every size — should use the v3.1 favicon assets with rust body and cream small tips — proposed fix: replace the data URI with `assets/favicon.svg`, add PNG fallbacks, `apple-touch-icon`, `mask-icon`, and manifest link.
- `site/manifest.webmanifest:theme_color` — current `#FF3D00` — should be rust `#C2410C` or ink `#0A0A0A` per prompt — proposed fix: use `#C2410C` if install chrome should feel branded, or `#0A0A0A` if it should blend with the dark site.
- `site/styles.css:.ticker .star` — current acid as a text glyph — should reserve acid for solid shapes only — proposed fix: make stars rust/cream text or convert them into small filled decorative shapes.
- `site/styles.css:.corpus .ln.hl` — current acid text — should not use acid for text — proposed fix: use cream + rust/vermillion accent, or a rust/oxblood pill/background if this needs emphasis.
- `site/styles.css:.mcp-log .arg` and `.docs-main pre .s` — current acid code token text — should not use acid for type — proposed fix: use parchment for string tokens and vermillion only for sparse active tokens.
- `site/styles.css:.block-tile h2 em` — current acid italic text on rust/dark surfaces — should not use acid for type — proposed fix: cream italic on rust, vermillion italic only on dark/ink.
- `site/styles.css:.tips-vermillion uoink-mark[data-size="small"] .u-tip-s` — current small wordmark override can make the <=32 px tips vermillion — should follow size-aware cream tips at <=32 px — proposed fix: do not override small-tip color except for deliberate large decorative marks.
- `site/styles.css` overall — vermillion appears as the default hover, active, label, code, CTA, footer, and heading accent across many components — should be roughly a 5% accent — proposed fix: promote rust for most brand emphasis and keep vermillion for CTAs, hover states, and one hero italic.

### Homepage: `site/index.html`

- `index.html:hero .eyebrow` — current `uoink.video` line uses vermillion/acid treatment and sits before the H1 — should feel like a small utility line, not compete with the headline — proposed fix: muted cream/parchment text with one rust separator.
- `index.html:.hero-demo .corpus .ln.hl` — current acid text highlight — should not use acid for type — proposed fix: cream text with rust left border or low-alpha rust background.
- `index.html:.mcp-log .arg` — current acid type in code demo — should be parchment/cream token color — proposed fix: reserve vermillion for function names and use parchment for args/strings.
- `index.html:Where Uoink runs card` — current `Yoink-Setup-2.0.0.exe` naming — should match the Uoink brand unless the installer is intentionally legacy-named — proposed fix: use `Uoink-Setup-2.0.0.exe` or label "current installer file: Yoink-Setup..." explicitly.
- `index.html:footer/final CTA mark` — current large decorative mark uses vermillion body — should use rust as primary surface, with vermillion only if intentionally loud — proposed fix: rust body, acid/cream tips per size.

### Creators: `site/creators.html`

- `creators.html:hero` — current H1 line clips on mobile ("Without watching at 2x" loses the right edge) — should remain fully readable at 375 px — proposed fix: reduce mobile H1 max size, set safer line-height, and ensure no child exceeds viewport width.
- `creators.html:prompt tiles` — current labels and accents lean vermillion-heavy — should move routine labels to rust/parchment — proposed fix: vermillion only on selected/primary callouts.
- `creators.html:AI privacy strip` — current final sentence says "Yoink itself collects nothing." — should use Uoink if the rename is final — proposed fix: "Uoink itself collects nothing."
- `creators.html:playlist heading` — current "Yoink ten. All at once." — should use Uoink after rename — proposed fix: "Uoink ten. All at once."

### Research: `site/research.html`

- `research.html:corpus/tree blocks` — current acid/rust code-token highlights include acid as text — should avoid acid type — proposed fix: use rust labels and parchment strings.
- `research.html:topic routing section` — current "User-editable topics... land in v2.1" is product-future copy in a live marketing page — should be clearer as roadmap, not implied current behavior — proposed fix: move to a small roadmap note or cut from primary body.
- `research.html:privacy block` — current final sentence says "Yoink itself collects nothing." — should use Uoink — proposed fix: "Uoink itself collects nothing."
- `research.html:path examples` — current uses both `~/uoink/` and `~/Desktop/Uoink/` elsewhere — should use one visible convention — proposed fix: choose `~/Desktop/Uoink/` for user-facing install pages and `~/uoink/` only if it is the real cross-platform output path.

### Agents: `site/agents.html`

- `agents.html:config snippet` — current inline `color:var(--acid)` for command string — should not use acid text — proposed fix: parchment or cream string color; keep vermillion for keys/function names.
- `agents.html:tool list` — current repeated vermillion tool names make the whole list feel equally urgent — should separate categories with rust and use vermillion sparingly — proposed fix: rust tool names, vermillion only for active/current highlight.
- `agents.html:hero lede` — current line overflows at 375 px by 141 px — should wrap inside viewport — proposed fix: audit wide inline/demo children inside `.agent-demo` and add `min-width:0` plus wrapping on code/pre.
- `agents.html:MCP HTTP card` — current "API surface considered unstable until v2.1" is useful but visually buried — should be a small explicit badge if kept — proposed fix: `experimental HTTP` badge using rust outline, not vermillion text.

### Agent docs: `site/agent-docs.html`

- `agent-docs.html:main` — current page has no H1 in the browser metrics — should have one visible H1 for hierarchy and SEO — proposed fix: make "Agent docs." or "Uoink agent docs." the H1.
- `agent-docs.html:.docs-main pre .s` — current acid code strings — should not use acid text — proposed fix: parchment/cream string token.
- `agent-docs.html:tool docs` — current docs mention `_all-yoinks-index.md` as the list source — should reflect the v2 index-backed reality if this page is public-facing — proposed fix: say "local index" or "library index" unless the file really remains canonical.
- `agent-docs.html:docs sidebar` — current sidebar becomes 572 px wide at 375 px due page overflow — should fit and wrap within viewport — proposed fix: set `min-width:0`, `max-width:100%`, and mobile-specific sidebar link wrapping.

### Install: `site/install.html`

- `install.html:installer card h3` — current `Yoink-Setup-2.0.0.exe` — should be `Uoink-Setup-2.0.0.exe` or explicitly marked legacy — proposed fix: align installer filename with brand decision.
- `install.html:hero/install CTA` — current 375 px CTA is 41 px tall — should be at least 44 px — proposed fix: mobile `.btn.large` min-height 44 px.
- `install.html:Windows-only copy` — current page says Windows is live and Mac queued, but several install details are Windows-specific — should be platform-gated during the port if Mac copy is already being prepared — proposed fix: Windows/Mac tabs or clearly labeled cards.

### Hooks article: `site/hooks.html`

- `hooks.html:taxonomy prose` — current body is visually clean and mostly v3.1-compliant — only recurring issue is the global favicon/ticker/wordmark treatment — proposed fix: apply global fixes.
- `hooks.html:final CTA` — current acid/vermillion relationship is close, but the CTA text still says "BYO Anthropic key for the AI calls" in one dense line — should read as a calm trust note — proposed fix: split local/AI key copy into two short lines.

### Privacy: `site/privacy.html`

- `privacy.html:version line` — current inline style uses `var(--vermillion-deep)`, which is not defined in v3.1 tokens — should use `--rust-deep` or `--oxblood` — proposed fix: replace undefined token with `--rust-deep`.
- `privacy.html:policy body` — visually the strongest compliance page: Inter, light mode, rust accents, no decorative overload — proposed fix: preserve this as the model for light docs pages.

## 2 · Hierarchy + scan (per page)

### Homepage

- Hero: strong. The eye lands on the wordmark/nav, then `Uoink that shit.`, then the CTA cluster, then the live corpus card.
- Eyebrow: visible but a touch loud because `uoink.video · v2.0` reads like the first content claim.
- Lede: good and direct. "Local. Yours. That's it." lands.
- Primary CTA: clear on desktop. On mobile, the H1/hero area is cramped and the line edge feels clipped; CTA remains reachable.
- Where the eye gets lost: after the hero, the corpus demo and the one-product/three-doors cards both compete as "the next thing." The live corpus is the more differentiated story; let it win.

### Creators

- Hero: strong concept, but the 375 px version clips the H1, which is the worst page-level mobile issue.
- Eyebrow: good audience routing.
- Lede: clear, creator-native, not SaaS-y.
- Primary CTA: visible.
- Where the eye gets lost: the YouTube-button mock is useful but visually quieter than the H1. After the first screen, the prompt grid is strong but dense; add a smaller section intro or tighter grouping during the port.

### Research

- Hero: clear and calmer than homepage. The corpus/index visual makes the value concrete.
- Eyebrow: accurate.
- Lede: good. "Indexable, greppable, citation-anchored" is the right research language.
- Primary CTA: visible, but the research page might want a secondary "See corpus schema" CTA above the fold.
- Where the eye gets lost: topic routing and entity graph are both persuasive, but the relationship between "folder routing" and "searchable index" needs one connective line.

### Agents

- Hero: very clear for the audience. "13 MCP tools. Local server." is direct.
- Eyebrow: good.
- Lede: good, but long; it wraps into a lot of text at smaller widths.
- Primary CTA: "Read the docs" is correct.
- Where the eye gets lost: the tool groups are useful but all three columns carry similar weight. The strongest proof is the agent conversation + MCP log, so keep that above tool inventory.

### Agent docs

- Hero/docs header: functional, but it lacks a visible H1.
- Eyebrow: breadcrumb works.
- Lede: clear reference-page framing.
- Primary CTA: none; that is okay for docs, but "Install first" could be the first action.
- Where the eye gets lost: the sidebar becomes too dominant on mobile and wide enough to cause overflow. The docs content itself is scannable.

### Install

- Hero: clear. "Install Uoink. Five minutes." is one of the best direct lines on the site.
- Eyebrow: clear.
- Lede: practical and trust-building.
- Primary CTA: obvious on desktop, slightly under target height on mobile.
- Where the eye gets lost: the first installer card repeats the CTA and installer payload before the steps. It may be worth leading with "1. Download / 2. Install extension / 3. First Uoink" and using the card as proof below.

### Hooks

- Hero/article title: strong. Reads like a field manual, not a feature page.
- Eyebrow: none; acceptable for article mode, but a small "field manual" kicker would help orient people coming from search/social.
- Lede: strong but long.
- Primary CTA: appears at the bottom, appropriate.
- Where the eye gets lost: the nine sections are clear. The "How to use this" section is a good landing point; consider adding a sticky mini TOC on desktop only.

### Privacy

- Hero/article title: clear.
- Eyebrow: none; acceptable.
- Lede: very clear.
- Primary CTA: none; correct for policy.
- Where the eye gets lost: it does not. This page is a good model for readable legal/trust copy.

## 3 · Mobile (375 px)

Measured horizontal overflow at 375 px:

| Page | Overflow |
|---|---:|
| `index.html` | 135 px |
| `creators.html` | 273 px |
| `research.html` | 0 px |
| `agents.html` | 141 px |
| `agent-docs.html` | 207 px |
| `install.html` | 201 px |
| `hooks.html` | 0 px |
| `privacy.html` | 0 px |

What breaks:

- Global nav touch targets: brand link measured 68 x 17 px; burger measured 38 x 38 px. Both should be at least 44 x 44 px.
- Desktop nav breakpoint is `max-width:760px`; at 768 px the full nav remains visible. It technically fits, but the tablet state feels cramped. Move the burger breakpoint up to roughly 820-900 px.
- `creators.html` H1 clips on the right at 375 px. This is the most visible mobile bug.
- `index.html`, `agents.html`, `agent-docs.html`, and `install.html` all produce horizontal scroll. Likely culprits are pre/code blocks, grid children missing `min-width:0`, wide inline examples, and hero/demo cards.
- `agent-docs.html` sidebar links measure 572 x 29 px at 375 px. They are both too wide and too short.
- `install.html` primary CTA measured 144 x 41 px. It needs a mobile min-height of 44 px.
- Mobile fullscreen menu opens and locks body scroll, but there is no Escape close, focus trap, or `aria-expanded` state on the trigger.

Recommended mobile fixes for Phase B:

- Add a global `min-width:0` pass to grid/flex children and `overflow-wrap:anywhere` for code/path examples.
- Raise nav collapse breakpoint.
- Add `min-height:44px` to all buttons/interactive nav controls at touch breakpoints.
- Add a mobile H1 rule that is based on content length, not only viewport width. The longest hero lines need more conservative sizing.
- Convert docs/sidebar link rows into a true horizontal scroll or compact select-like jump list on 375 px.

## 4 · Accessibility

### Contrast ratios measured

The browser metrics produced some inherited-background false positives for nested cards, so the ratios below use the actual palette combinations visible in the hero/nav/CTA/footer surfaces.

| Surface combo | Ratio | Status |
|---|---:|---|
| Cream `#FFF4EC` on ink `#0A0A0A` | 18.29:1 | Pass |
| Cream `#FFF4EC` on ink-soft `#1A1612` | 16.62:1 | Pass |
| Parchment `#CFC8B9` on ink `#0A0A0A` | 11.89:1 | Pass |
| Vermillion `#FF3D00` on ink `#0A0A0A` | 5.58:1 | Pass for normal text, but should be sparse by brand rule |
| Ink `#0A0A0A` on vermillion `#FF3D00` CTA | 5.58:1 | Pass |
| Rust `#C2410C` on cream `#FFF4EC` | 4.78:1 | Pass, close enough for normal text |
| Muted warm `#7A7569` on ink `#0A0A0A` | 4.31:1 | Fails AA for small normal text |
| Muted warm `#7A7569` on cream `#FFF4EC` | 4.24:1 | Fails AA for small normal text |
| Acid `#FFD23F` on ink `#0A0A0A` | 13.71:1 | Contrast passes, brand rule fails because acid should not be type |

Per page hero/nav/CTA/footer summary:

| Page | Hero body | Hero accent | Nav | CTA | Footer |
|---|---|---|---|---|---|
| Homepage | cream/ink 18.29 | vermillion/ink 5.58; muted meta 4.31 fail | cream/ink pass | ink/vermillion 5.58 pass | cream/ink 18.29; parchment/ink 11.89 |
| Creators | cream/ink 18.29 | vermillion/ink 5.58 | cream/ink pass | ink/vermillion 5.58 pass | cream/ink 18.29 |
| Research | cream/ink 18.29 | vermillion/ink 5.58; muted code labels borderline | cream/ink pass | ink/vermillion 5.58 pass | cream/ink 18.29 |
| Agents | cream/ink 18.29 | vermillion/ink 5.58; acid code brand-fail | cream/ink pass | ink/vermillion 5.58 pass | cream/ink 18.29 |
| Agent docs | ink/cream 18.29 | rust/cream 4.78 | ink/cream pass | ink/vermillion 5.58 where present | cream/ink 18.29 |
| Install | cream/ink 18.29 | vermillion/ink 5.58 | cream/ink pass | ink/vermillion 5.58 pass | cream/ink 18.29 |
| Hooks | ink/cream 18.29 | rust/cream 4.78 | ink/cream pass | ink/vermillion 5.58 where present | cream/ink 18.29 |
| Privacy | ink/cream 18.29 | rust/cream 4.78 | ink/cream pass | no primary CTA | cream/ink 18.29 |

### Findings

- Focus rings: no `:focus-visible` or branded outline rules found in `styles.css`. Browser defaults may appear, but the system does not intentionally support keyboard focus.
- Mobile menu ARIA: burger has `aria-label="Open menu"` but no `aria-expanded`, `aria-controls`, or state update.
- Mobile menu keyboard behavior: no Escape close and no focus trap. Body scroll is locked, but keyboard focus can likely escape behind the overlay.
- Reduced motion: no `prefers-reduced-motion` rule. `site.js` animates corpus lines with `setTimeout`, opacity, transform, and transition.
- Header landmarks: all pages have `<nav>`, `<main>`, and `<footer>`, but only homepage exposes a `banner` role via ticker. The rest have no semantic `<header>`/banner.
- Agent docs: no visible H1 detected. Add one for hierarchy and screen-reader navigation.
- SVG roles: `uoink-mark` injects `<svg aria-label="Uoink" role="img">` for every instance, including decorative/footer marks. In brand links this can make names repetitive; decorative marks should be `aria-hidden="true"` while the link carries `aria-label="Uoink home"`.
- Burger SVGs do not appear to be `aria-hidden`. The button has a label, so the icon should be hidden.
- Image alt: no missing `<img>` alt issues were found, mostly because the prototype uses SVG/CSS rather than content images.
- Touch targets: global mobile brand and burger controls are below 44 px; install CTA is 41 px tall.
- Keyboard nav order: likely follows DOM order, but the hidden mobile menu is `display:none` until open. Once open, focus management needs explicit handling.
- Contrast: muted warm text fails AA for small text on both ink and cream. It appears in meta/caption contexts; either raise to parchment on dark or use larger/bolder text.

## 5 · Performance (predicted)

- LCP risk: pages are mostly text/CSS, so LCP should be good after port. The risk is not image size; it is blocking script/font behavior.
- Homepage-specific risk: `index.html` loads React 18 development UMD, ReactDOM development UMD, Babel standalone, then two `text/babel` scripts for the tweaks panel. This should not ship on the public homepage.
- Font loading: CSS references Inter, Bungee, and JetBrains Mono, but I found no `@font-face`, `font-display`, preload, or hosted font links. The prototype looked good locally because fonts are likely installed. Production should self-host or use Next/font with `font-display:swap`.
- CLS risk: `<uoink-mark>` renders after the deferred web component loads. The wrapper has dimensions, so major shift is contained, but brand links may briefly show only "OINK" or an empty U slot. Keep explicit width/height on every mark.
- CLS risk: if Bungee is not available immediately, the wordmark width may shift after font load. Preload/self-host the wordmark font.
- Image format: favicon PNGs are tiny and fine. `og-image.png` is also small, but it is the wrong size/aspect for common social previews.
- Motion: corpus-line animation is low cost, but should be disabled for reduced motion.
- CSS: one global CSS file is fine. During the port, avoid splitting critical nav/hero styles behind delayed client JS.
- PWA: `manifest.webmanifest` exists, but pages do not appear to link it. Add manifest and icon links in the production `<head>`.
- Social meta: pages do not appear to include OG/Twitter tags. This hurts unfurl performance and control more than runtime performance.

## 6 · Favicon experience (per size)

Opened actual files in `site/assets/` and rendered a contact sheet.

- `assets/favicon.svg` — reads clearly. Rust body + cream tips match small-mark legibility. Good source for browser SVG favicon.
- `assets/favicon-16.png` — readable as a U at 16 px, but the lower left/right antialiasing/ringing is visible at high zoom. In real tab size it should pass. Cream tips are correct.
- `assets/favicon-32.png` — reads clearly. Cream tips correct. Edges have a tiny stair-step but acceptable.
- `assets/favicon-64.png` — reads clearly. Cream tips correct. This is the strongest small favicon.
- `assets/apple-touch-icon-180.png` — reads well on iOS-style rounded black tile. Cream tips correct. Strong.
- `assets/icon-192.png` — reads well for Android/PWA. Cream tips are used, which is acceptable at this app-icon scale because the black tile carries the brand.
- `assets/icon-512.png` — reads well, but uses acid tips. This matches large icon behavior and has enough contrast.
- `assets/maskable-512.png` — safe-zone looks good. It uses orange/rust background and black U with acid tips. Cropping should survive Android masks.
- Current page-linked data SVG — fail. It bypasses the generated v3.1 favicon set and uses vermillion body + acid tips even at small sizes.

Cross-platform prediction:

- Chrome tab, light theme: asset `favicon.svg` should pass; current inline data favicon is too hot and not v3.1 small-tip compliant.
- Chrome tab, dark theme: asset `favicon.svg` should pass because cream tips separate from rust body; current inline data favicon is noisier.
- Safari pinned tab: no `mask-icon` link found. Need a monochrome silhouette SVG. The current multicolor favicon is not the pinned-tab asset.
- iOS home screen: `apple-touch-icon-180.png` passes visually, but no page link was found.
- Android home screen: manifest points to `icon-192`, `icon-512`, and maskable icon. Visual assets pass; page needs `rel=manifest`.
- Windows Start Menu PWA: `icon-512.png` and `maskable-512.png` should read. Manifest theme color should change from vermillion to rust/ink.
- Bookmarks bar: `favicon-16.png` passes if wired. Current inline data SVG is the wrong variant.

## 7 · Social + share previews

- `assets/og-image.png` — local file measures 924 x 540, not 1200 x 630. It is therefore neither the prompt's expected OG size nor the ideal GitHub size.
- Facebook debugger — not live-testable from the local prototype because there is no public URL, but current file size/aspect would be a fail/rework.
- Twitter/X card validator — not live-testable locally; predicted fail/rework because the pages lack visible `twitter:*` meta tags and the image is not 1200 x 630.
- LinkedIn post inspector — not live-testable locally; predicted fail/rework for the same missing meta + image ratio issue.
- Slack unfurl — not live-testable locally; predicted fallback to title/description unless OG tags are added.
- Discord/iMessage/WhatsApp — not live-testable locally; predicted fallback/uncontrolled.
- GitHub repo social preview — current OG asset is the wrong aspect. GitHub wants 1280 x 640. Produce a separate `github-social-preview.png`.

Proposed GitHub social preview render:

- Size: 1280 x 640.
- Background: ink `#0A0A0A`.
- Top-left small line: `UOINK v2.0 · LOCAL-FIRST YOUTUBE RESEARCH`
- Main copy: `Uoink any video. Read it like a doc.`
- Secondary: `Markdown corpus · screenshots · comments · MCP tools`
- Visual: large magnet-U at right, rust body with acid large tips.
- Footer: `github.com/ryanbiddy/uoink`

## 8 · Microcopy

- `index.html:hero H1` — current: `Uoink that shit.` — proposed: keep if Ryan chooses loud route; CWS-safe fallback is `Uoink any video. Read it like a doc.`
- `index.html:hero eyebrow` — current: `uoink.video · v2.0` — proposed: `v2.0 · Windows live · local-first`
- `index.html:status line` — current: `MAC V2.1 IN QUEUE · CHROME WEB STORE PENDING REVIEW · MIT ON GITHUB` — proposed: `Windows live · Mac queued · Chrome Web Store pending · MIT on GitHub`
- `index.html:installer card` — current: `Yoink-Setup-2.0.0.exe · ~120 MB` — proposed: `Uoink-Setup-2.0.0.exe · ~120 MB` if the file can be renamed; otherwise `Current installer: Yoink-Setup-2.0.0.exe`.
- `index.html:hook classifier section` — current: `Yoink's hook classifier sorts...` — proposed: `Uoink's hook classifier sorts...`
- `creators.html:hero H1` — current: `Decode what's working. Without watching at 2x.` — proposed: `Decode what's working. Skip the 2x watch.`
- `creators.html:prompt tile` — current: `"What's underdeveloped? Where could this be sharper?"` — proposed: `"What's underdeveloped? What should I sharpen first?"`
- `creators.html:playlist H2` — current: `Yoink ten. All at once.` — proposed: `Uoink ten. All at once.`
- `creators.html:privacy strip` — current: `Yoink itself collects nothing.` — proposed: `Uoink collects nothing.`
- `research.html:topic routing` — current: `User-editable topics with persistent overrides land in v2.1.` — proposed: `Today: edit topics.json. Later: manage topics in the app.`
- `research.html:uncategorized` — current: `that's where the cleanup work happens later.` — proposed: `That's your review pile. Rename it when the pattern becomes obvious.`
- `research.html:privacy card` — current: `Yoink itself collects nothing — no analytics...` — proposed: `Uoink collects nothing: no analytics, no telemetry, no remote logs.`
- `agents.html:hero lede` — current: `No clipboard step, no copy-paste, no "describe the video to me."` — proposed: keep. This is one of the best lines.
- `agents.html:assistant demo` — current: `Two seconds.` — proposed: remove or soften unless true under real extraction. `I'll pull the corpus, then search the local index.`
- `agent-docs.html:list_recent_yoinks description` — current: `Returns the last N entries from ~/uoink/_all-yoinks-index.md.` — proposed: `Returns the last N yoinks from the local index.`
- `install.html:hero lede` — current: `Both ship together.` — proposed: `The installer gives you both.`
- `install.html:Mac card CTA` — current: `Watch GitHub Discussions` — proposed: `Follow the Mac build`
- `privacy.html:analytics paragraph` — current: `Opt-in install-success telemetry is on the v1.1 roadmap...` — proposed: remove from public privacy page unless it is still planned. It creates anxiety on a page that otherwise says "none."

## 9 · Net-new sections / improvements I plan to ship during the port

- `improvement` — Wire a complete production head component: canonical URL, OG tags, Twitter tags, manifest, apple icon, PNG favicon fallbacks, mask icon, and theme color.
- `improvement` — Remove the homepage React/Babel tweaks panel from production. If kept, move it to a non-public preview route controlled by Ryan.
- `improvement` — Add a global mobile overflow fix pass: `min-width:0`, safer pre/code wrapping, raised nav breakpoint, mobile H1 clamps, and 44 px touch targets.
- `improvement` — Add accessible nav behavior: `aria-expanded`, `aria-controls`, Escape close, focus trap, focus return, and branded `:focus-visible`.
- `improvement` — Add `prefers-reduced-motion` support for corpus animations and hover transforms.
- `improvement` — Normalize brand tokens in production CSS: rust primary, vermillion sparse, acid only solid shapes.
- `improvement` — Add one real H1 to `agent-docs.html`.
- `improvement` — Self-host/load Inter, Inter italic, Bungee, and JetBrains Mono with `font-display:swap`; preload the wordmark/display font only if needed.
- `improvement` — Generate separate social assets: OG 1200 x 630 and GitHub 1280 x 640.
- `improvement` — Convert repeated footer/nav/head markup into shared components during the port, so the eight pages cannot drift.
- `idea` — Add a compact "See a real corpus" interactive preview page with one sanitized sample corpus.
- `idea` — Add a "Uoink for agents" config snippet generator that switches between Claude Desktop, Cursor, Continue, Cline, and generic stdio.
- `idea` — Add a public `/llms.txt` and `/llms-full.txt` for agent-readable product docs.
- `idea` — Add a "field manual" index page for Hook Type taxonomy, Comment Intelligence, Entity Extraction, and citations.

## 10 · Open questions for Ryan

1. Hero headline on `/`: A) `Uoink that shit.` loud route, or B) `Uoink any video. Read it like a doc.` CWS-safe route?
2. Tweaks panel: A) remove entirely from production, B) ship as public `/preview`, or C) auth-gate/private-preview only?
3. Mac waitlist: A) keep "join/follow GitHub Discussion", or B) add an email collector?
4. `/llms.txt`: A) ship at launch, or B) wait until after the site is ported and docs settle?
5. Installer filename: A) rename public artifact to `Uoink-Setup-2.0.0.exe`, or B) keep `Yoink-Setup-2.0.0.exe` and explicitly call it a legacy filename?
6. Domain/canonical: A) commit to `uoink.video`, or B) use a path/subdomain under `ryanbiddy.com` for launch?
7. Profanity placement: A) allow `Uoink that shit.` on homepage but use safe copy in Web Store/listings, or B) make the public site safe everywhere?
8. Product status copy: A) keep forward-looking "Mac v2.1 in queue" throughout the site, or B) reduce roadmap mentions to the install page only?

# Uoink site

Production marketing site for [Uoink](https://uoink.app), the local-first YouTube layer for any AI.

Built with Next.js App Router and deployed to Vercel. The product repo lives at [github.com/ryanbiddy/uoink](https://github.com/ryanbiddy/uoink); this repo is only the marketing site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The site uses `output: "export"` for static deployment.

## Release facts

`content/release.json` supplies the product version and verified MCP counts to the site and both release-content scripts. Static discovery cards and crawler text must match it; `check-launch-content.cjs` checks those copies.

```bash
python scripts/sync-mcp-from-release.py E:/AI/projects/uoink/checkouts/Yoink-integration
node scripts/check-launch-content.cjs
```

The sync script reads committed files with `git show`, parses Python ASTs without importing product code, and checks stdio names against `.mcpb/manifest.json`. It defaults to the product ref in `content/release.json`; `--ref <git-ref>` selects another ref. It writes only the site's tool catalog and manifest.

For 3.9.1, regenerate from `release/3.9.1` with `--ref release/3.9.1` until the `v3.9.1` tag is created, then rerun against the tag. The catalog has 35 stdio tools and 91 HTTP tools. The public changelog keeps the 3.9.1 patch separate from 3.9.0, which includes the unpublished 3.8.x work since v3.7.0. Earlier public release dates are preserved; no 3.9.0 publication date is asserted.

## Deploy

Connect this repo to Vercel and let it auto-detect Next.js. Production canonical is `uoink.app`; the legacy video domain redirects there.

## Brand

Brand v3.1 is the source of truth: rust primary, vermillion sparse, acid only as solid shapes, Inter-led typography, Bungee wordmark only. See [docs/V3.1-LEGIBILITY-PATCH.md](docs/V3.1-LEGIBILITY-PATCH.md).

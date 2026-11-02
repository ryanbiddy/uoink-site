# IndexNow — instant re-crawl pings on deploy

IndexNow lets us tell Bing (and Yandex, Seznam, Naver — they share the protocol)
the moment a page changes, instead of waiting for a crawl. Google does not consume
IndexNow, but Bing feeds ChatGPT Search, so this is worth wiring.

No account is required. Ownership is proven by a key file hosted on the site.

## Key file (already committed)

- Key: `9b91f5a5988d705a3f25641817b2f574`
- Hosted at: `https://uoink.app/9b91f5a5988d705a3f25641817b2f574.txt`
- The file contains exactly the key, no newline. Do not edit or rename it — the
  ping's `keyLocation` must match this exact URL.

## The one command to ping (run after each deploy)

Ping the homepage (Bing + Yandex will then re-crawl):

```bash
curl "https://api.indexnow.org/indexnow?url=https://uoink.app/&key=9b91f5a5988d705a3f25641817b2f574&keyLocation=https://uoink.app/9b91f5a5988d705a3f25641817b2f574.txt"
```

A 200 or 202 response means accepted. That is all Ryan needs to run.

## Optional: ping a batch of URLs after a bigger release

```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "uoink.app",
    "key": "9b91f5a5988d705a3f25641817b2f574",
    "keyLocation": "https://uoink.app/9b91f5a5988d705a3f25641817b2f574.txt",
    "urlList": [
      "https://uoink.app/",
      "https://uoink.app/sources/youtube",
      "https://uoink.app/compare/notebooklm",
      "https://uoink.app/install",
      "https://uoink.app/developers",
      "https://uoink.app/mcp"
    ]
  }'
```

## Automatic ping after each production deploy

`.github/workflows/indexnow.yml` runs when Vercel reports a successful
`Production` deployment to GitHub. It runs `scripts/indexnow-ping.mjs`, which
reads the live sitemap and submits the URLs with the newest `lastmod`. No secret
is involved.

Run it by hand from a checkout:

```bash
node scripts/indexnow-ping.mjs --dry-run     # list what would be sent
node scripts/indexnow-ping.mjs               # newest pages
node scripts/indexnow-ping.mjs --all         # every sitemap URL, e.g. once after setup
```

Or start the workflow from GitHub: Actions > IndexNow ping > Run workflow
(tick "all" to submit every URL).

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

## Optional: fire it automatically from a Vercel deploy hook

Add a Deploy Hook (Vercel → Project → Settings → Git → Deploy Hooks won't call
out; instead use a post-deploy step). Simplest reliable option is a tiny GitHub
Action on push to `main`:

```yaml
# .github/workflows/indexnow.yml
name: IndexNow ping
on:
  push:
    branches: [main]
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping IndexNow
        run: |
          curl -sS "https://api.indexnow.org/indexnow?url=https://uoink.app/&key=9b91f5a5988d705a3f25641817b2f574&keyLocation=https://uoink.app/9b91f5a5988d705a3f25641817b2f574.txt"
```

This is optional. The single `curl` above, run by hand after a deploy, is enough.

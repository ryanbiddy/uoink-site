# Uoink Any Page: Our Crawl4AI Fork

Most web scraping tools are designed for large-scale cloud jobs. They require proxy rotation, complex selector configurations, and heavy cloud infrastructure. 

For a local-first application like Uoink, these tools are too heavy. We needed a fast way to scrape clean content from technical blogs, docs, and news sites directly from the browser. 

We built a custom fork of Crawl4AI to handle this task. This fork runs locally on your machine, integrating with Uoink's local Python helper and SQLite database. 

Here is how our Crawl4AI fork works and how it powers universal page uoinking.

## The Problem with Standard Scrapers

Standard browser scrapers extract the raw HTML of a page. HTML contains massive amounts of noise. You get navigation links, cookie banners, footer text, advertisements, and tracking scripts. 

If you feed this raw HTML to an AI agent, you waste thousands of context tokens on noise. It slows down the processing speed. 

Crawl4AI was built to solve this. It parses the page, runs extraction algorithms, and returns clean markdown. 

We customized Crawl4AI to integrate with our local Python server. Our fork strips away all layout noise. It returns only the main article text, code blocks, and relevant image references.

## Running Scrapes Locally

Our fork runs inside the local helper at `%LOCALAPPDATA%\Uoink\`. It uses no third-party scraping API. 

When you right-click a technical article and select "Uoink page," the Chrome extension sends the URL to the local helper at `127.0.0.1:5179`. 

The helper starts a local Playwright instance managed by Crawl4AI. It loads the page, waits for JavaScript elements to render, and takes a full-page screenshot. 

Here is how the Python helper instantiates the local scraper:

```python
from crawl4ai import WebCrawler
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

async def scrape_local_page(url: str):
    async with WebCrawler() as crawler:
        result = await crawler.arun(
            url=url,
            bypass_cache=True,
            screenshot=True,
            remove_overlay_elements=True
        )
        return {
            "markdown": result.markdown,
            "screenshot": result.screenshot_path,
            "title": result.title
        }
```

It processes the DOM. It extracts the main content block, converts it to clean markdown, and saves both the markdown file and the screenshot into your local folder. 

Finally, it indexes the content in `%LOCALAPPDATA%\Uoink\index.db` using SQLite's FTS5 engine. The entire process takes less than 3 seconds.

## Managing Dynamic Content and Timeouts

Technical sites often load content dynamically using client-side React or Vue hydration. If a scraper parses the HTML before hydration completes, it misses the main content. 

Our fork addresses this by configuring Playwright network idle states. The crawler waits for the network to remain quiet for at least 500 milliseconds before initiating DOM parsing. 

We also added custom timeout handling. If a site takes longer than 10 seconds to respond, Uoink aborts the request and falls back to a basic HTTP GET fetch. This ensures a slow site won't lock up the entire helper queue.

## The Allowed Sites List

Universal scraping can cause security issues if left unrestricted. We block malicious sites from querying the local server. 

We built an allowed-site list into the extension setup page. You can access this list in the Settings tab of the dashboard. 

The helper only processes scrapes for domains that you explicitly add to this list. By default, popular documentation sites and technical blogs are allowed. 

If you try to uoink a page from a domain outside the list, you will see a popup asking for permission. This block prevents background scripts from abusing your local scraper.

## Grounding Your Agent with uoink_page

Our Crawl4AI integration is exposed as an MCP tool called `uoink_page`. 

This tool allows your AI agent in Cursor or Claude Desktop to scrape any page you are reading in real-time. 

Suppose you are coding a TypeScript application and need to read the latest docs for a library. You can tell your agent:

```text
Uoink the page https://example.com/docs/api. Summarize the routing configuration.
```

The agent calls `uoink_page` with the URL. 

```json
{
  "name": "uoink_page",
  "arguments": {
    "url": "https://example.com/docs/api"
  }
}
```

The local helper runs the Crawl4AI script. It returns clean markdown containing the routing configuration. 

The agent reads this markdown and writes the code. You skip manual doc copying.

## Local Speed and Clean Content

Our custom Crawl4AI fork makes page extraction fast. By running Playwright locally, it uses your local network context. 

If you are logged into a documentation site, Playwright can often capture the authenticated state from your active browser profile. This allows it to scrape pages behind login screens. 

The resulting markdown files are saved in topic-classified folders. They are clean. They contain zero tracking links or ad scripts. 

By forking Crawl4AI and bolting it onto a local SQLite index, we created a tool for gathering research. You can build a local, searchable library of technical documentation that is always available offline.

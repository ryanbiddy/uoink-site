# Why Your AI Agent Should Have a Corpus

If you use AI agents to write code or draft text, you have likely run into the limits of generic LLMs. You ask an agent to write a script or solve a bug. It spits out generic code patterns from three years ago. 

This happens because the model has no context. It relies on its pre-training data. It has no access to your specific research, your preferred libraries, or your style preferences. 

Giving your AI agent a structured local corpus changes the entire workflow. When you ground an agent in a database of specific sources, you replace generic guesses with precise domain knowledge. 

Here is why your agent needs a corpus, and how we built this pattern into Uoink.

## The Problem with Generic LLM Knowledge

Standard language models are trained on massive web crawls. They contain billions of parameters, yet they lack specific, up-to-date context. 

When you ask a model to write a script for a new library, it will often hallucinate API endpoints. It combines outdated documentation with current syntax. This results in broken code that you have to debug manually. 

A local corpus solves this problem. It acts as a private library of reference materials. When you query the agent, it first searches this private library to find the exact documentation or code examples needed for the task.

## Grounding in Action via MCP

The Model Context Protocol (MCP) provides a clean way to connect AI agents to local data. We designed Uoink with a built-in MCP server that exposes over 65 tools to your AI client. 

When you run Cursor or Claude Desktop, the agent can call these tools to search and read your local library. It searches your local library before it falls back to web search or memory. 

If you ask your agent to write a script about a specific database topic, the agent can call `search_uoinks` to find every relevant video, podcast, or page you have saved. It then calls `get_uoink_corpus` to read the full transcripts and code blocks. 

This grounding ensures the agent writes code that matches the exact APIs and versions in your library. It prevents the model from inventing endpoints.

## Beyond Simple Text: Transcripts and Comments

A complete corpus contains more than raw documentation. It needs real-world context. 

When Uoink saves content, it grabs more than text. It compiles the full timestamped transcript, screenshots, metadata, and the top 50 comments. 

This comment data is highly valuable for AI agents. By reading comments, the agent learns what problems real users faced with the technology. It identifies common pitfalls and workarounds. 

If your agent writes a tutorial based on your corpus, it can read the comments to see where viewers got confused. It can address those specific issues in the new draft. This level of detail is missing from generic documentation.

## The Speed of Local Indexing

Many developers try to solve the context problem by pasting massive files into the prompt window. This approach is slow. It wastes tokens. It quickly hits context window limits. 

Uoink solves this by indexing everything locally. It stores your corpus in `%LOCALAPPDATA%\Uoink\index.db` using SQLite's FTS5 search extension. 

When your agent needs information, it runs a fast keyword search across the database. It retrieves only the relevant chunks. This keeps your prompts small and fast. It also keeps your API costs low. 

You can monitor these database queries in the native dashboard window. When the agent calls the MCP tools, you see the active database search queries run in real-time.

## Keeping Your Data Private

A local-first architecture keeps your data secure. Your corpus resides on your machine. 

Uoink uploads zero corpus files to a cloud server. It skips search tracking. The only time your data leaves your machine is when the agent sends the selected search results to your chosen LLM provider. 

This local design means you can store sensitive company transcripts or private code snippets without worrying about data leaks. You maintain complete control over your files.

## Future Roadmap: Optional Sync Tier

While local storage is ideal for privacy, developers often work across multiple devices. They want their research library available on both their work laptop and their home desktop. 

To solve this, we are planning a paid hosted sync tier. 

This tier will use end-to-end encryption. Your local helper will encrypt your SQLite database and markdown files before uploading them to our server. We won't hold the keys to decrypt your files. 

This hosted sync tier is optional. It will allow you to access your corpus on multiple machines without compromising your privacy. If you skip the sync tier, the core application remains fully functional as a local-first utility.

## How to Set It Up

To give your agent access to your corpus, you need to configure the MCP settings. Open the Uoink dashboard and navigate to the Settings tab. Copy the JSON config snippet. 

Paste this snippet into your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "uoink": {
      "command": "node",
      "args": ["C:/Users/hello/AppData/Local/Uoink/mcp/server.js"]
    }
  }
}
```

Restart your AI client. The agent now has access to your library. 

You can test this by asking the agent: "Search my library for Rust database optimization. Summarize the main techniques." The agent will run the search tool, parse the results, and write a summary grounded in your saved files.

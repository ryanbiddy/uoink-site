# How to Write a Script Grounded in Your Corpus

Most creators write scripts using memory. They read articles, watch videos, and take notes. When they sit down to write, they copy ideas from their messy notepad. 

This process is slow. It leads to shallow scripts that repeat common talking points. 

Using Uoink's local corpus and Writing Studio, you can write scripts directly grounded in your research. By feeding your writing agent specific transcripts, comment threads, and style anchors, you can draft structured scripts that preserve your unique voice. 

Here is how to set up a grounded writing workflow.

## Step 1: Gather Your Reference Material

Before you write, you need reference data. You want to gather the best explanations, code snippets, and critiques on your topic. 

Use Uoink to build your folder of resources. If you are writing a script on database replication, find three high-quality videos on YouTube. Click the rust U button on each watch page to uoink them. 

If there is a detailed technical blog post on the topic, right-click the page. Select "Uoink page" to extract the content using the Crawl4AI parser. 

Uoink saves these files on disk as clean markdown files. It indexes the transcripts and metadata in your local SQLite index. You now have a solid foundation of source texts.

## Step 2: Register a Style Anchor

A style anchor is a piece of text that represents your target tone and structure. Uoink uses these anchors to prevent the AI from generating generic language. 

Choose a script or post you wrote that performed well. Make sure it sounds like you. It should contain your typical sentence structure, contraction usage, and formatting. 

You can register this anchor using the `add_style_anchor` MCP tool. Or you can add it directly in the dashboard's Settings tab. 

When you generate a script, Uoink feeds this style anchor into the LLM system prompt. The model analyzes your rhythm and word choices. It applies those patterns to the new draft.

## Step 3: Query Your Local Database

Now, connect your AI writing agent to your corpus. If you are using Cursor or Claude Desktop, the Uoink MCP server handles this connection. 

Ask your agent to search your saved files for the key topics. Use a specific query. 

For example, you can tell the agent:

```text
Search my uoinks for database replication. Retrieve the three most detailed transcripts.
```

The agent runs the `search_uoinks` tool. It returns the exact text chunks, code blocks, and comments. 

Grounding your prompt in these specific files ensures the AI uses accurate facts. It uses the source files instead of guessing replication parameters. It uses the exact terms from the engineers in the source videos.

## Step 4: Manage the Context Token Budget

Large technical transcripts can easily consume your entire prompt context window. A two-hour podcast transcript might contain 25,000 words. Dumping multiple full transcripts into an LLM prompt is slow, expensive, and often results in the model ignoring the middle sections of the text. 

Uoink solves this using a clipboard token budget preview in the popup. 

When you select multiple uoinks to compile, Uoink estimates the token count of the combined output. It shows you a warning if the total exceeds your set threshold (default is 16,000 tokens). 

To reduce the size, you can opt to exclude comments or screenshots. You can also configure the FTS5 query to return only relevant 1,000-word chapters instead of the entire transcript. This optimization keeps the prompts fast and your API bills low.

## Step 5: Write the Grounded Prompt

To generate the script, write a prompt that references your retrieved files. Skip the generic script request. Ask for a structure built on the evidence. 

Here is a prompt template you can use:

```text
Using the transcripts from the database replication uoinks, write a 5-minute video script. 
Use the tone and formatting of my registered style anchor. 
Include the code example from the third transcript. 
Reference the common developer mistakes mentioned in the comment sections.
```

This prompt forces the AI to construct the script using concrete details. 

By referencing the comment sections, the script addresses actual user pain points. If viewers in the source video complained that the backup configuration was confusing, your script can dedicate a section to explaining that configuration.

## Step 6: Edit in the Writing Studio

Once the LLM generates the draft, open the Uoink dashboard and navigate to the Writing Studio tab. Here you will see the generated draft next to your source files. 

Check the draft for voice violations. Uoink's built-in auditor scans the text for banned phrases. If the model slipped into generic patterns, you will see a soft warning. 

Squeeze out the fluff. Use physical verbs. Make sure the technical code blocks match your source material. 

By grounding your writing in a local corpus, you reduce research time. You build scripts that are technically accurate and match your personal brand.

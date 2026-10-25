# Loop engineering: what Boris Cherny and Claire Vo agree on

Loop engineering is the practice of designing loops: setups where an AI agent runs a job on its own, on a schedule or toward a goal, with a way to check its own work. You stop typing the next prompt and write the job that does the prompting for you.

The term is new, and it moved fast. On June 17, Claire Vo was already saying "I like this article by Addy Osmani about loop engineering" ([06:08](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=368s)). On June 30, Andrew Ng shared [a letter on three loops](https://www.storyboard18.com/how-it-works/google-brain-co-founder-andrew-ng-says-ai-wont-replace-developers-explains-loop-engineering-103402.htm). On July 17, [IBM defined it](https://www.ibm.com/think/topics/loop-engineering) as "the practice of designing agentic workflows, or loops, that iteratively guide AI agents toward completing user-defined goals with minimal human intervention."

That's the dictionary version. Here are three sources that show the work.

## The three sources

**The lesson: Boris Cherny at YC Startup School 2026.** Boris created Claude Code at Anthropic, and his team has Claude maintaining its own apps: "now we have every day maybe 20 or 30 of these routines" ([29:40](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1780s)). Start at [20:13](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1213s) and watch to about 30:00.

**The podcast: Claire Vo on How I AI.** Claire's solo episode opens with a complaint about the loop explainers going around: "to be honest, I don't think any of them explained it very well" ([01:53](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=113s)). She covers heartbeats, crons, hooks and goals, then builds loops in Claude Code and Codex.

**The X video: Matt Van Horn.** Matt Van Horn ([@mvanhorn](https://x.com/mvanhorn)) posted [a video on X](https://x.com/mvanhorn/status/2068438900193042695) on June 20, 2026: a list of real loops people run, with commands you can copy. Watch it after the other two. They give you the idea. This gives you the menu. It has no transcript yet, so nothing below quotes it.

## Where they agree

Boris builds the tool. Claire teaches the practice. They land on the same three rules.

### 1. Give it a way to check its work

Boris says verification is "the single most important thing that people do not get right" ([20:31](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1231s)). His recipe for a long run is short: give the model the task, then "give it a way to verify the output of its work" ([22:43](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1363s)).

His example: he asked Claude to rewrite Claude's Electron desktop app in Swift, screenshot the original, then "look pixel by pixel, compare it to the Swift version, don't stop until you're done" ([21:48](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1308s)). When he told the story, it had been running "like 14 days, 15 days" ([22:06](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1326s)).

Claire builds the check into the loop itself. A goal loop "runs an agent against that outcome until the outcome can be measured and validated" ([05:35](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=335s)), or until the agent is blocked. Her rule: "you have to be very precise about evaluation and success criteria" ([27:11](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=1631s)). Skip that, she says, and "you will be very disappointed and use a lot of tokens" ([27:18](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=1638s)).

### 2. Run it on a schedule

Same cadences, nearly word for word. Boris: "You can do it like maybe every hour, every 5 minutes, every day" ([28:07](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1687s)). Claire: "You can set a schedule, like every 30 minutes, every hour, every 5 minutes" ([03:50](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=230s)).

That's the whole point of a loop. In Claire's words, "you do not have to use your human fingers to type in a prompt" ([05:13](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=313s)).

Claire adds hooks, which Boris doesn't cover in this talk: "you can prompt an agent based on an internal life cycle," like a tool call or a new session ([04:35](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=275s)).

### 3. Write it as one clear job

Boris: "For loops and routines, it's one task that is repetitive" ([27:59](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1679s)). Claire: "You are designing a job" ([09:36](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=576s)).

One job gives you one finish line to check and one schedule to run it on. Five jobs in one loop give you neither.

## Where they differ: how much to write

Boris keeps the job tiny: "one routine is clean up dead code. This is a single prompt" ([28:31](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1711s)). Then: "It's like one sentence" ([28:35](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1715s)). He says longtime engineers trip on the opposite habit: "this is a really really common failure mode is trying to over specify" ([24:16](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=1456s)).

Claire writes the job like a manager. Her advice: "just imagine that you're onboarding an employee" ([09:39](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=579s)). Her example names the day, the checks and the hand-off. It opens "Every Friday, EA, I would like you to review my calendar" ([09:55](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=595s)) and ends "and send me a Slack to get this done" ([10:06](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=606s)). Especially for goal loops, she says "writing the prompt really precisely is super super important" ([26:51](https://www.youtube.com/watch?v=JoXbk2fm7jM&t=1611s)).

They're closer than it sounds. Boris's warning is about dictating the how, making the model do the task exactly your way. Earlier in the same talk, on prompting in general, he says "You want to describe the task, you want to describe the guardrails," and then the exit criteria ([15:19](https://www.youtube.com/watch?v=qyPCVqFUyDo&t=919s)). Claire's precision is aimed at the same target: what done looks like.

So: keep the how short. Spell out what done means like it's someone's first day.

## How this post was made

The receipts came first. An AI agent pulled the caption files for both YouTube talks, found each line and took its time from the word-level timings in those files. Every quote from the two talks was then checked again, word for word, against the same captions. Each link opens the video at that line.

That first step is the job Uoink does. It saves YouTube videos, podcasts, and X posts and videos into a local library on your own disk, and any AI you use can search it and cite the timestamp. It's free, MIT licensed and runs on Windows 10/11. Claude Code, Cursor and Codex connect over MCP. ChatGPT works by copy and paste.

Save the talk. Keep the receipts. Uoink that shit.

## Sources

1. Boris Cherny, interviewed by Diana Hu. "Boris Cherny: We Cut 80% of Claude Code’s Prompt." Y Combinator, YC Startup School 2026. July 27, 2026. 35:51. [https://www.youtube.com/watch?v=qyPCVqFUyDo](https://www.youtube.com/watch?v=qyPCVqFUyDo)
2. Claire Vo. "How to write AI agent loops in Claude Code and Codex." How I AI. June 17, 2026. 29:07. [https://www.youtube.com/watch?v=JoXbk2fm7jM](https://www.youtube.com/watch?v=JoXbk2fm7jM)
3. Matt Van Horn (@mvanhorn). Video post on X. June 20, 2026. [https://x.com/mvanhorn/status/2068438900193042695](https://x.com/mvanhorn/status/2068438900193042695)
4. Ivan Belcic and Cole Stryker. "What is loop engineering?" IBM Think. July 17, 2026. [https://www.ibm.com/think/topics/loop-engineering](https://www.ibm.com/think/topics/loop-engineering)
5. Storyboard18. "Google Brain co-founder Andrew Ng says AI won't replace developers, explains 'loop engineering'." July 7, 2026, reporting Andrew Ng's June 30 letter. [https://www.storyboard18.com/how-it-works/google-brain-co-founder-andrew-ng-says-ai-wont-replace-developers-explains-loop-engineering-103402.htm](https://www.storyboard18.com/how-it-works/google-brain-co-founder-andrew-ng-says-ai-wont-replace-developers-explains-loop-engineering-103402.htm)

Every spoken quote here comes from YouTube's machine captions, runs 15 words or fewer, and is timed to its first word.

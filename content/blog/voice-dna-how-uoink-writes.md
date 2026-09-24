# Voice DNA: How Uoink Writes

Most AI writing sounds identical. It is stuffed with corporate buzzwords, polite filler, and predictable transitions. It sounds like a marketing brochure written by a committee. 

We hate this writing style. We call it AI slop. 

When we built Uoink's Writing Studio, we knew we had to solve this problem. We created a voice spec called Voice DNA to force the AI to write like a sharp, direct human. 

Here is the philosophy behind Voice DNA and how we enforce it programmatically in our codebase.

## The Rules of Clear Writing

Voice DNA is a set of guidelines that prioritizes clarity and speed. It is built on three core pillars: simplicity, specificity, and punchy rhythms. 

We require short paragraphs. Each paragraph should contain one to three sentences. This layout keeps technical articles readable on mobile screens and terminal windows. 

We require natural contractions. Words like "don't," "can't," and "it's" make the tone sound human. 

We avoid throat-clearing. We skip introductory paragraphs that explain why a topic is important. We start directly with the core problem. 

We also ban em dashes entirely. Em dashes encourage long, rambling sentences. We replace them with periods, commas, or parentheses to keep the writing structured.

## Banning the Buzzwords

We maintain a strict list of banned words. These are terms that immediately flag a piece of text as AI-generated. 

We ban specific verbs that suggest deep exploration or diving. We ban corporate nouns that refer to fields of study or enterprise systems. 

We ban marketing phrases that promise ten-times productivity increases or state that a tool changes everything. We also ban mechanical transition words that academic writers use to link paragraphs. 

These words add zero value. They waste the reader's time. By stripping them out, we force the AI to use physical verbs and concrete nouns.

## The Fatal Rule: Negation Framings

Our most critical rule bans negation framings. 

A negation framing occurs when a writer states that something is a failure, and then asserts a correction. This is a common pattern in marketing copy. It sounds unnatural in conversation. 

We require the AI to state the positive claim directly. 

Instead of declaring a tool as a cache alternative to a database, the AI must write: "This tool is a local cache. It is different from a database." 

This rule eliminates argumentative filler. It forces the writing to be assertive and direct.

## Review the draft

The local HTTP registry includes `write_tweet` and `write_blog`. Their descriptions specify a two-phase flow: the calling agent receives grounding context, then submits a draft for storage and a Voice DNA scan. Warnings are soft; these tools do not automatically block the draft.

Read the output yourself. Check that each factual statement is supported by the saved source and that the citation points to the right moment. A style scan cannot do that judgment for you.

## Why Voice Matters

Clear writing reflects clear thinking. When a tool writes in a direct, slightly cynical tone, it builds trust with developers. 

Developers hate fluff. They want the code, the installation steps, and the benchmark results. 

Use the guidelines when you review a draft. It sounds like it was written by an engineer who is in a hurry. That is exactly the voice we want.

It acts as an insurance policy against corporate language. Keep the factual review and the style review separate.

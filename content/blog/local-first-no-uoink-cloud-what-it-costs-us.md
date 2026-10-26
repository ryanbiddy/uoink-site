# Local-First, No Uoink Cloud: What It Costs Us

When we started building Uoink, we made a core design decision. We decided to build a local-first application. There are no Uoink accounts or hosted corpus databases. Model dependencies can still send telemetry.

Your transcripts, metadata, and screenshots live on your local drive. The searchable index lives in a local SQLite database at `%LOCALAPPDATA%\Uoink\index.db`.

This decision was great for user privacy. It also came with severe costs for our business. 

Here is what the local-first model costs us, and why we decided to build Uoink this way.

## Onboarding Friction is High

A standard web application has a simple onboarding flow. You visit a website, click sign up, enter an email, and you are inside the dashboard. 

For Uoink, onboarding is a heavy process. You must download a native executable. On Windows, you run an Inno Setup installer. The installer is unsigned. On an Apple Silicon Mac (macOS 15 or later), the preview since 3.11.2 is a DMG you drag to Applications.

After installation, the python helper starts. It runs as a local loopback server on `127.0.0.1:5179`. You then install a Chrome extension to talk to this helper. 

This process requires multiple steps. It requires local permissions. Many potential users click away before completing the setup. This high friction reduces our conversion rates compared to standard SaaS tools.

## The Friction of Bring Your Own Key

In addition to downloading a native installer, users must bring their own Anthropic API key to use the AI classification features. 

This is a massive point of friction. Many creators have never used an API key. They want to avoid developer accounts on console.anthropic.com and credit loading on a billing page. 

We had to build an entire diagnostic and key-testing UI into the extension setup page. We added a cost estimator to show users how cheap it is to pay Anthropic directly compared to paying a SaaS markup. 

For developers, this is a benefit. Optional AI features use their own Anthropic key. For non-technical users, it is a barrier that prevents them from using the tool.

## No Uoink Crash-Report Endpoint

If a user runs into a bug, we have no automated way of knowing. The helper has no dedicated Uoink crash-report upload endpoint. The pinned pyannote model dependency enables its own metrics by default, including during voice-activity detection. See the [privacy page](/privacy) for network behavior and controls.

This makes product development difficult. We can't see which hook types are most popular. We can't see how many playlists fail because of YouTube rate limits. 

We rely entirely on users filing issues on GitHub. When they file a report, they must manually open the Uoink dashboard, export a diagnostic log, and paste it into the issue. 

This lack of automatic crash reports makes resolving issues slow. It forces us to write highly detailed local validation routines to help users debug their local setup on their own.

## Monetization is Difficult

Standard SaaS startups charge a recurring monthly fee. They can do this because they manage the database, pay for servers, and lock your data inside their cloud. 

Charging a monthly fee gets harder. We run zero servers for your data. You run the app on your own machine. You pay Anthropic directly for your token usage. 

This makes monetization a challenge. We are exploring a paid hosted sync tier for users who want multi-device syncing, but the core tool will remain free and open source. 

By making the code open source under the MIT license, we invite users to inspect the application. This builds trust, but it prevents us from locking users into a closed ecosystem.

## Designing for Offline Autonomy

One of the biggest design advantages of a local-first tool is offline capability. Because your corpus lives on your hard drive, you can search your library and read saved transcripts offline.

If you are on an airplane or working in a remote area without internet access, you can still read saved files and search the local index. The SQLite index runs without a network request to run a text search.

New captures, subscription polling, model downloads, dependency telemetry, remote thumbnails, release checks and AI calls use the internet. The extension also opens a Claude tab after copying a completed capture; it does not paste or submit the content.

This design means your productivity is never tied to our servers. If our company closes down or our site goes offline, your local copy of Uoink continues to work. You are never locked out of your research library.

## Why We Still Chose Local-First

Despite these business challenges, the local-first model provides benefits that a cloud SaaS rarely match. 

The first benefit is speed. Searching a local SQLite database using FTS5 search is faster than querying a remote API. Your search results appear instantly. 

The second benefit is privacy. Your transcripts and notes belong to you. Uoink does not host your library. Content you share with an AI client or copy into a synced folder is handled by that service.

The third benefit is security. Your Anthropic API key is stored locally in Windows Credential Manager. It never touches our servers.

Building a local-first application is a difficult path for a business. It forces you to build high-quality software because you can't patch bugs on a central server. For our users, the resulting privacy and performance are worth the trade-off.

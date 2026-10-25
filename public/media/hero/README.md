# Swap the hero videos

Ryan, put your clips in this folder with the exact names below. Replace a file to swap its video, then rebuild the site. No code changes are needed. If a clip is missing, its space says “Your video here.”

This repo is public. Add only clips you own or have cleared for public use. The three named slots and their matching `.jpg` covers are cleared: "Cleared by Ryan for public use on uoink.app, Oct 24 2026."

All three slots are filled with cleared clips: the lesson at 22:42 to 22:48, the podcast at 05:32 to 05:38 and the X video at 0:29.5 to 0:33.5.

| File name | Where it appears | Shape | Good length |
| --- | --- | --- | --- |
| `source-lesson.mp4` | First video below the story, in the saved-video section before “Send to Zing” | Wide, 16:9 | 4–8 seconds |
| `source-podcast.mp4` | Second video in that section | Wide, 16:9, or square, 1:1 | 4–8 seconds |
| `source-x-video.mp4` | Third video in that section | Wide, 16:9, or square, 1:1 | 4–8 seconds |

The three sources are final. Empty slots use the wide shape. Filled videos keep their own shape. All three are silent previews; sound is not needed.

Keep each loop under about **600 KB**, and all three together under **1.5 MB**. Short clips are easier to keep small.

You can add a cover picture with the same name and `.jpg` instead of `.mp4`, such as `source-lesson.jpg`. It is optional. If you replace a video, replace its cover too, or delete the old cover and run the check below to make a fresh one.

## Check the folder

Open a terminal in the site folder and run:

```sh
npm run media
```

It lists all three slots as filled, missing, too big or wrong shape. It also shows each video's size, width, height and length. Missing slots are fine. If a cover picture is missing, it makes one from the first frame.

To make oversized clips smaller:

```sh
npm run media -- --shrink
```

This keeps the first original as, for example, `source-lesson.orig.mp4`. Originals stay on your computer and are left out of Git and the built site. The smaller copy keeps the video's length, removes sound and fits the slot's shape without cutting off the picture. If it still cannot fit, use a shorter clip. Square podcast and X clips stay square.

These commands use ffmpeg and ffprobe. They look on PATH first, then in `E:/AI/tools/ffmpeg-8.1.2/bin/`. If either tool is missing, the command tells you and still reports the files and sizes it can check.

## Change the words

Open `labels.json` in a text editor. Under `sources`, each card has its title, date, length and source link. Lesson and podcast `receipts` contain exact caption quotes, displayed times and timestamped links. The X video uses a `summary` with no quotation or timestamp.

Keep quotes and links identical to the approved source JSON. Public-safe copies of those records live in `scripts/fixtures/UOINK-SOURCES-FINAL.json` and `scripts/fixtures/receipts.json`. After building, run `node scripts/check-hero-sources.cjs` to check the exported homepage against them. A new source needs a verified record before its labels change.

Under `example`, change the Example labels, saved-video label and runtime counter. Under `drafts`, change the sample writing and story times. Rebuild after saving. A typo in the file stops the build so it cannot silently publish broken labels.

## Preview or rebuild

For a local preview, run `npm run dev`, then open `http://localhost:3000`. After swapping a video, restart the preview and refresh the page.

For the finished site, run `npm run build`. The finished files go in `out`. To preview those exact files, run `npm run preview`, then open `http://localhost:3000`. Stop either preview with Ctrl+C. Publish through the site's usual deployment process when ready.

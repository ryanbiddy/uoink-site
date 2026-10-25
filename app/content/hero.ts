import story from "./hero-story.json";
import labels from "../../public/media/hero/labels.json";
import { slots, renderSlot } from "../../scripts/hero-media.cjs";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function label(key: string): string {
  const value = key.split(".").reduce<unknown>((node, part) => node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined, labels);
  if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing hero label: ${key}`);
  if (key.endsWith(".url") && !/^(https?:\/\/|\/(?!\/)|#)/.test(String(value))) throw new Error(`Use a website address or page anchor for ${key}`);
  return escape(String(value));
}
const savedSource = `<div class="saved-source saved-source-text"><div class="source-meta"><strong>${label('example.savedTitle')}</strong><span>${label('example.savedTimestamp')} · ${label('example.savedStatus')}</span></div></div>`;
// Next bundles the helper into .next/server; resolve public from the build root.
const heroMedia = `<div class="hero-media-gallery" aria-label="Saved video examples">${slots.map(slot => renderSlot(slot, `${process.cwd()}/public/media/hero`)).join('')}</div>`;

const storyHtml = story.html.replace("{{savedSource}}", savedSource).replace("{{heroMedia}}", heroMedia).replace(/\{\{([\w.]+)\}\}/g, (_, key: string) => label(key)).replace(story.returnToDraft,
  `<span data-return-label="draft">${story.returnToDraft}</span><span data-return-label="answer" hidden>${story.returnToAnswer}</span>`);
const filmHtml = storyHtml.replace(/<\/div>$/, `<a class="scene-deeper source-disclosure" href="#live-uoink">${story.deeperLabel} <span aria-hidden="true">↓</span></a></div>`);
export const HERO_HTML = `<div class="hero-story" id="uoink-home"><div class="story-motion-control"><button type="button" id="story-motion-toggle" aria-pressed="false" data-pause="Pause motion" data-resume="Resume motion">Pause motion</button></div>${filmHtml}</div>`;

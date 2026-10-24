"use client";

import { useEffect } from "react";

declare global { interface Window { initUoinkStory?: (root: HTMLElement) => (() => void) | undefined } }

export function HeroMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hero-story");
    if (!root) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const init = () => { if (!cancelled) dispose = window.initUoinkStory?.(root); };
    const script = document.createElement("script");
    if (window.initUoinkStory) init();
    else { script.src = "/hero-story.js"; script.onload = init; document.head.append(script); }
    return () => { cancelled = true; dispose?.(); script.remove(); };
  }, []);
  return null;
}

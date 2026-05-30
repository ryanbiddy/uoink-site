"use client";

import { useEffect } from "react";

export function EmbedMode() {
  useEffect(() => {
    const isEmbed = new URLSearchParams(window.location.search).get("embed") === "true";
    if (!isEmbed) return;

    document.documentElement.classList.add("feature-embed");
    return () => document.documentElement.classList.remove("feature-embed");
  }, []);

  return null;
}


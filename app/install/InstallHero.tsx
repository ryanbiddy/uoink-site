"use client";

import { useEffect, useState } from "react";

// The one primary action on /install. The server render, and Windows, show the
// Windows installer. A small effect swaps in the Mac disk image or the Linux
// anchor once the browser reports its platform. URLs, version and sizes come
// from the page (content/release.json via pages.ts and product-status.ts).

type Os = "windows" | "mac" | "linux";

export type HeroOption = {
  label: string;
  href: string;
  meta: string;
  markHtml?: string;
};

function detectOs(): Os {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || navigator.platform || "";
  const probe = `${platform} ${navigator.userAgent}`;
  // iPhone and iPad report "like Mac OS X"; they cannot run the helper, so they keep the default.
  if (/iphone|ipad|ipod|android/i.test(probe)) return "windows";
  if (/mac/i.test(platform) || /Macintosh|Mac OS X/i.test(probe)) return "mac";
  if (/linux|x11|cros/i.test(probe)) return "linux";
  return "windows";
}

export function InstallHero({ options }: { options: Record<Os, HeroOption> }) {
  const [os, setOs] = useState<Os>("windows");

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const current = options[os];

  return (
    <div className="ip-action">
      <a className="btn primary large with-logo ip-cta" href={current.href} data-os={os}>
        {current.markHtml ? <span className="ip-cta-mark" dangerouslySetInnerHTML={{ __html: current.markHtml }} /> : null}
        {current.label}
      </a>
      <p className="ip-meta" aria-live="polite">{current.meta}</p>
    </div>
  );
}

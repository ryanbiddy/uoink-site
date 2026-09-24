"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function VercelAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Static previews do not serve Vercel's hosting-specific insights endpoint.
    setEnabled(!["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname));
  }, []);

  return enabled ? <Analytics path={pathname} route={pathname} /> : null;
}

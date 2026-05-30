"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

export function VercelAnalytics() {
  const pathname = usePathname();

  return <Analytics path={pathname} route={pathname} />;
}

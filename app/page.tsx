import type { Metadata } from "next";
import { PageShell } from "./components/PageShell";
import { pages } from "./content/pages";
import { HeroMotion } from "./components/HeroMotion";
import "./hero-story.css";

const page = pages.home;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." }] },
  twitter: { title: page.title, description: page.description, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Uoink: Save what you watch. Your AI writes from it, with receipts." }] },
};

export default function Page() {
  return <><PageShell page={page} /><HeroMotion /></>;
}

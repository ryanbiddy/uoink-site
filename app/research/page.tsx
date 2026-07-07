import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { pages } from "../content/pages";

const page = pages.research;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route, images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "The Uoink dashboard: a populated local corpus of saved videos ready to hand to your AI." }] },
  twitter: { title: page.title, description: page.description, images: ["/og-cover.png"] },
};

export default function Page() {
  return <PageShell page={page} />;
}

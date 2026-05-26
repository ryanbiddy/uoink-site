import type { Metadata } from "next";
import { PageShell } from "../components/PageShell";
import { pages } from "../content/pages";

const page = pages.how;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.route },
  openGraph: { title: page.title, description: page.description, url: page.route },
  twitter: { title: page.title, description: page.description },
};

export default function Page() {
  return <PageShell page={page} />;
}

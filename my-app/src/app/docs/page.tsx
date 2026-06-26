import type { Metadata } from "next";
import DocsClient from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs — ImmunoLab",
  description: "Internal codebase documentation for AllergoExpress ImmunoLab.",
  robots: { index: false, follow: false },
};

export default function DocsPage() {
  return <DocsClient />;
}

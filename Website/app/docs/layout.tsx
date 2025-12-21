import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "HEXNODE documentation covering resource pools, server management, performance tuning, and advanced infrastructure concepts.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


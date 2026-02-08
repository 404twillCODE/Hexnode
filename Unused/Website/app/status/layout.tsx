import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status",
  description: "Current operational status of NODEXITY services including website, control panel, node infrastructure, and API.",
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


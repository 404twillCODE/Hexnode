import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hosting",
  description: "Nodexity hosting plans — Recycle Hosting on repurposed hardware and Premium Hosting on a global edge network.",
};

export default function HostingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

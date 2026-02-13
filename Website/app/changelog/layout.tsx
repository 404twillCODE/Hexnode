import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Development updates, releases, and milestones for Nodexity.",
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

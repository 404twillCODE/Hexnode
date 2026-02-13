import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Get notified about Nodexity launches, updates, and early access.",
};

export default function NewsletterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

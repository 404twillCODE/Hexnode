import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Nodexity development — donate via PayPal, Cash App, Ko-fi, or Buy Me a Coffee.",
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

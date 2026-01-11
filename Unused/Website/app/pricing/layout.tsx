import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple resource-based pricing for HEXNODE. No per-server limits. Choose from Starter, Pro, or Power resource pools.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


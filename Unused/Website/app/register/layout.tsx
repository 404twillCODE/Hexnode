import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your NODEXITY account and start building without limits.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


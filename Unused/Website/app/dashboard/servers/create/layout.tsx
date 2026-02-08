import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Server",
  description: "Deploy a new server from your NODEXITY resource pool.",
};

export default function CreateServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


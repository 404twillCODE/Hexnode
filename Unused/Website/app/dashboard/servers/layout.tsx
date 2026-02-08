import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servers",
  description: "Manage all servers running within your NODEXITY resource pool.",
};

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


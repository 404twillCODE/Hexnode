import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Server Manager",
  description: "Nodexity Server Manager — a desktop app for creating and managing Minecraft servers locally.",
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launcher",
  description: "Nodexity Launcher — a planned custom Minecraft launcher for game installs, mods, and profiles.",
};

export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return children;
}

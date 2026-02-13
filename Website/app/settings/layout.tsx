import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure Nodexity website preferences — boot sequence and display settings.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

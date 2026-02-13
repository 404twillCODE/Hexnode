import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Compare Nodexity with other Minecraft server managers: Pterodactyl, MineOS, AMP, McMyAdmin, Crafty Controller.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

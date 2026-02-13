"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

type CellValue = "yes" | "no" | "planned" | string;

const TOOLS: { id: string; name: string; highlight?: boolean }[] = [
  { id: "nodexity", name: "Nodexity", highlight: true },
  { id: "pterodactyl", name: "Pterodactyl" },
  { id: "mineos", name: "MineOS" },
  { id: "amp", name: "AMP (CubeCodr)" },
  { id: "mcmyadmin", name: "McMyAdmin" },
  { id: "crafty", name: "Crafty Controller" },
];

const ROWS: { label: string; key: string; values: Record<string, CellValue> }[] = [
  {
    label: "Open source / license",
    key: "opensource",
    values: {
      nodexity: "AGPL-3.0 / MIT (site)",
      pterodactyl: "Yes (MIT)",
      mineos: "Yes (GPL)",
      amp: "No (commercial)",
      mcmyadmin: "No (commercial)",
      crafty: "Yes (GPL-3.0)",
    },
  },
  {
    label: "Local-first (no server required)",
    key: "localfirst",
    values: {
      nodexity: "yes",
      pterodactyl: "no",
      mineos: "no",
      amp: "no",
      mcmyadmin: "no",
      crafty: "no",
    },
  },
  {
    label: "Multi-server type support (Paper, Spigot, Fabric, Forge, etc.)",
    key: "multitype",
    values: {
      nodexity: "yes",
      pterodactyl: "yes",
      mineos: "yes",
      amp: "yes",
      mcmyadmin: "yes",
      crafty: "yes",
    },
  },
  {
    label: "Built-in console",
    key: "console",
    values: {
      nodexity: "yes",
      pterodactyl: "yes",
      mineos: "yes",
      amp: "yes",
      mcmyadmin: "yes",
      crafty: "yes",
    },
  },
  {
    label: "Plugin management",
    key: "plugins",
    values: {
      nodexity: "yes",
      pterodactyl: "yes",
      mineos: "yes",
      amp: "yes",
      mcmyadmin: "yes",
      crafty: "yes",
    },
  },
  {
    label: "World management",
    key: "worlds",
    values: {
      nodexity: "yes",
      pterodactyl: "yes",
      mineos: "yes",
      amp: "yes",
      mcmyadmin: "yes",
      crafty: "yes",
    },
  },
  {
    label: "Resource monitoring",
    key: "monitoring",
    values: {
      nodexity: "yes",
      pterodactyl: "yes",
      mineos: "yes",
      amp: "yes",
      mcmyadmin: "yes",
      crafty: "yes",
    },
  },
  {
    label: "Hosting integration",
    key: "hosting",
    values: {
      nodexity: "planned",
      pterodactyl: "yes",
      mineos: "no",
      amp: "yes",
      mcmyadmin: "no",
      crafty: "no",
    },
  },
  {
    label: "Launcher integration",
    key: "launcher",
    values: {
      nodexity: "planned",
      pterodactyl: "no",
      mineos: "no",
      amp: "no",
      mcmyadmin: "no",
      crafty: "no",
    },
  },
  {
    label: "Price",
    key: "price",
    values: {
      nodexity: "Free",
      pterodactyl: "Free (self-host)",
      mineos: "Free",
      amp: "Paid",
      mcmyadmin: "Paid (legacy)",
      crafty: "Free",
    },
  },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  const isYes = value === "yes";
  const isNo = value === "no";
  const isPlanned = value === "planned";
  const isText = !isYes && !isNo && !isPlanned;

  return (
    <td
      className={`border border-border px-3 py-3 text-sm ${
        highlight ? "bg-accent/5 border-accent/20" : "bg-background-secondary/50"
      }`}
    >
      {isYes && (
        <span className="inline-flex items-center gap-1.5 text-accent font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Yes
        </span>
      )}
      {isNo && (
        <span className="text-text-muted font-mono">—</span>
      )}
      {isPlanned && (
        <span className="inline-flex items-center gap-1.5 text-amber-400/90 font-mono text-xs uppercase tracking-wider">
          Planned
        </span>
      )}
      {isText && (
        <span className="text-text-secondary font-mono text-xs sm:text-sm">{value}</span>
      )}
    </td>
  );
}

function ToolCard({
  tool,
  rows,
  index,
}: {
  tool: { id: string; name: string; highlight?: boolean };
  rows: typeof ROWS;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 25 }}
      className="system-card p-6"
    >
      <h3
        className={`font-mono text-lg font-semibold mb-4 ${
          tool.highlight ? "text-accent" : "text-text-primary"
        }`}
      >
        {tool.name}
      </h3>
      <dl className="space-y-3">
        {rows.map((row) => {
          const value = row.values[tool.id];
          const isYes = value === "yes";
          const isNo = value === "no";
          const isPlanned = value === "planned";
          return (
            <div key={row.key} className="flex justify-between gap-4 border-t border-border/50 pt-3">
              <dt className="text-xs text-text-muted font-mono flex-shrink-0 max-w-[50%]">
                {row.label}
              </dt>
              <dd className="text-xs font-mono text-text-secondary text-right">
                {isYes && "Yes"}
                {isNo && "—"}
                {isPlanned && "Planned"}
                {!isYes && !isNo && !isPlanned && value}
              </dd>
            </div>
          );
        })}
      </dl>
    </motion.div>
  );
}

export default function ComparePage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: "-80px" });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="mb-12"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-mono mb-8"
        >
          ← Back to Overview
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl font-mono mb-4">
          COMPARE
        </h1>
        <p className="text-lg leading-relaxed text-text-secondary sm:text-xl max-w-3xl">
          How Nodexity stacks up against other Minecraft server managers. We focus on
          local-first, open source, and a single desktop app — no VPS or web panel required.
        </p>
      </motion.div>

      {/* Mobile: stacked cards per tool */}
      <div className="lg:hidden space-y-6">
        {TOOLS.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} rows={ROWS} index={index} />
        ))}
      </div>

      {/* Desktop: scrollable table */}
      <div ref={tableRef} className="hidden lg:block overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
          className="system-card overflow-hidden min-w-[800px]"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border bg-background-secondary px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-text-muted w-48">
                  Feature
                </th>
                {TOOLS.map((tool) => (
                  <th
                    key={tool.id}
                    className={`border border-border px-4 py-3 text-center text-sm font-mono font-semibold ${
                      tool.highlight
                        ? "bg-accent/10 text-accent border-accent/30"
                        : "bg-background-secondary text-text-primary"
                    }`}
                  >
                    {tool.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <td className="border border-border px-4 py-3 text-sm text-text-secondary font-mono bg-background-secondary/50">
                    {row.label}
                  </td>
                {TOOLS.map((tool) => (
                  <Cell
                    key={tool.id}
                    value={row.values[tool.id as keyof typeof row.values]}
                    highlight={tool.highlight}
                  />
                ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 25 }}
        className="mt-12 flex flex-wrap gap-4"
      >
        <Link href="/software" className="btn-primary">
          <span className="relative z-20 font-mono">LEARN ABOUT NODEXITY</span>
        </Link>
        <Link href="/" className="btn-secondary">
          <span className="relative z-20 font-mono">BACK HOME</span>
        </Link>
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Replace with your real donation links
const donationOptions = [
  {
    id: "paypal",
    name: "PayPal",
    description: "Send a one time or recurring tip via PayPal.",
    href: "https://paypal.me/YourUsername",
    icon: (
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" />
      </svg>
    ),
    color: "text-[#00457C]",
    borderHover: "hover:border-[#00457C]/40 hover:bg-[#00457C]/5",
  },
  {
    id: "cashapp",
    name: "Cash App",
    description: "Quick support with Cash App.",
    href: "https://cash.app/$YourCashtag",
    icon: (
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.59 3.475a5.1 5.1 0 00-3.05-3.05c-1.31-.42-2.5-.42-4.92-.42H8.36c-2.4 0-3.61 0-4.9.4a5.1 5.1 0 00-3.05 3.06C0 4.765 0 5.965 0 8.365v7.27c0 2.41 0 3.6.4 4.9a5.1 5.1 0 003.05 3.05c1.3.41 2.5.41 4.9.41h7.28c2.41 0 3.61 0 4.9-.4a5.1 5.1 0 003.06-3.06c.41-1.3.41-2.5.41-4.9v-7.25c0-2.41 0-3.61-.41-4.91zm-6.17 4.63l-.93.93a.5.5 0 01-.67.01 5 5 0 00-3.22-1.18c-.97 0-1.94.32-1.94 1.21 0 .9 1.04 1.2 2.24 1.65 2.1.7 3.84 1.58 3.84 3.64 0 2.24-1.74 3.78-4.58 3.95l-.26 1.2a.49.49 0 01-.48.39H9.63l-.09-.01a.5.5 0 01-.38-.59l.28-1.27a6.54 6.54 0 01-2.88-1.57v-.01a.48.48 0 010-.68l1-.97a.49.49 0 01.67 0c.91.86 2.13 1.34 3.39 1.32 1.3 0 2.17-.55 2.17-1.42 0-.87-.88-1.1-2.54-1.72-1.76-.63-3.43-1.52-3.43-3.6 0-2.42 2.01-3.6 4.39-3.71l.25-1.23a.48.48 0 01.48-.38h1.78l.1.01c.26.06.43.31.37.57l-.27 1.37c.9.3 1.75.77 2.48 1.39l.02.02c.19.2.19.5 0 .68z" />
      </svg>
    ),
    color: "text-[#00D54B]",
    borderHover: "hover:border-[#00D54B]/40 hover:bg-[#00D54B]/5",
  },
  {
    id: "kofi",
    name: "Ko-fi",
    description: "Buy me a coffee or leave a tip on Ko-fi.",
    href: "https://ko-fi.com/yourusername",
    icon: (
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.351 2.715c-2.7 0-4.986.025-6.83.26C2.078 3.285 0 5.154 0 8.61c0 3.506.182 6.13 1.585 8.493 1.584 2.701 4.233 4.182 7.662 4.182h.83c4.209 0 6.494-2.234 7.637-4a9.5 9.5 0 0 0 1.091-2.338C21.792 14.688 24 12.22 24 9.208v-.415c0-3.247-2.13-5.507-5.792-5.87-1.558-.156-2.65-.208-6.857-.208m0 1.947c4.208 0 5.09.052 6.571.182 2.624.311 4.13 1.584 4.13 4v.39c0 2.156-1.792 3.844-3.87 3.844h-.935l-.156.649c-.208 1.013-.597 1.818-1.039 2.546-.909 1.428-2.545 3.064-5.922 3.064h-.805c-2.571 0-4.831-.883-6.078-3.195-1.09-2-1.298-4.155-1.298-7.506 0-2.181.857-3.402 3.012-3.714 1.533-.233 3.559-.26 6.39-.26m6.547 2.287c-.416 0-.65.234-.65.546v2.935c0 .311.234.545.65.545 1.324 0 2.051-.754 2.051-2s-.727-2.026-2.052-2.026m-10.39.182c-1.818 0-3.013 1.48-3.013 3.142 0 1.533.858 2.857 1.949 3.897.727.701 1.87 1.429 2.649 1.896a1.47 1.47 0 0 0 1.507 0c.78-.467 1.922-1.195 2.623-1.896 1.117-1.039 1.974-2.364 1.974-3.897 0-1.662-1.247-3.142-3.039-3.142-1.065 0-1.792.545-2.338 1.298-.493-.753-1.246-1.298-2.312-1.298" />
      </svg>
    ),
    color: "text-[#FF5E5B]",
    borderHover: "hover:border-[#FF5E5B]/40 hover:bg-[#FF5E5B]/5",
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    description: "Buy a coffee once or support monthly.",
    href: "https://buymeacoffee.com/yourusername",
    icon: (
      <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
      </svg>
    ),
    color: "text-[#FFDD00]",
    borderHover: "hover:border-[#FFDD00]/40 hover:bg-[#FFDD00]/5",
  },
];

export default function DonatePage() {
  return (
    <section className="full-width-section relative min-h-[80vh] bg-background">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-mono text-text-secondary transition-colors hover:text-accent"
        >
          ← Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="font-mono text-3xl font-semibold uppercase tracking-wider text-text-primary sm:text-4xl lg:text-5xl">
            Support Nodexity
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            I&apos;m a single developer building the app, website, and everything around it. 
            Any support helps keep this project going — and if you can&apos;t donate, that&apos;s okay too. 
            Starring the repo or joining Discord means a lot.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {donationOptions.map((option, i) => (
            <motion.a
              key={option.id}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className={`group flex flex-col gap-4 rounded-xl border border-border bg-background-secondary/80 p-6 transition-all duration-200 ${option.borderHover}`}
            >
              <div className={`flex items-center gap-3 ${option.color}`}>
                {option.icon}
                <span className="font-mono text-lg font-medium uppercase tracking-wider text-text-primary">
                  {option.name}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">
                {option.description}
              </p>
              <span className="mt-auto font-mono text-xs uppercase tracking-wider text-accent opacity-80 group-hover:opacity-100">
                Open {option.name} →
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-8"
        >
          <span className="text-sm text-text-muted">Other ways to help:</span>
          <a
            href="https://github.com/404twillCODE/Nodexity"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-background-secondary/80 px-4 py-2 text-sm font-mono text-text-secondary transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
          >
            Star on GitHub
          </a>
          <a
            href="https://discord.gg/rFJeUQ6CbE"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-background-secondary/80 px-4 py-2 text-sm font-mono text-text-secondary transition-colors hover:border-[#5865F2]/40 hover:bg-[#5865F2]/10 hover:text-white"
          >
            Join Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
}

import Link from "next/link";

const changelogEntries = [
  {
    date: "2025-02",
    badge: "Website",
    title: "Website improvements",
    items: [
      "Page metadata and SEO for all routes",
      "Open Graph and Twitter card metadata",
      "robots.txt and sitemap.xml",
      "Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)",
      "React error boundary for unhandled errors",
      "Prettier and format-on-save",
      "CI workflow: lint, typecheck, format check, build",
      "Accessibility: skip-to-content link, footer nav landmark, main content ID",
      "Next.js security patch (14.2.0 → 14.2.35)",
      "Comparison page, changelog page, newsletter signup",
    ],
  },
  {
    date: "2025-01",
    badge: "Website",
    title: "Website launch",
    items: [
      "Homepage with boot sequence and product sections",
      "Docs, FAQ, Support, Status, Donate, Privacy, Terms",
      "Server Manager, Launcher, Hosting (Recycle & Premium) pages",
      "Settings page with boot sequence toggle",
      "Payment and Software pages with download flow",
    ],
  },
  {
    date: "2024",
    badge: "Early access",
    title: "Server Manager early access",
    items: [
      "Desktop app (Electron + React) for Windows",
      "Create and manage Minecraft servers (Paper, Spigot, Vanilla, Fabric, Forge, etc.)",
      "Integrated console, plugin manager, world manager, file editor",
      "Resource monitoring (CPU, RAM, disk)",
      "Download available on GitHub Releases",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <section className="full-width-section relative bg-background-secondary">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-mono mb-8"
          >
            ← Back to Overview
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            CHANGELOG
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Development updates and milestones. Newest first.
          </p>
        </div>

        <div className="space-y-6 border-t border-border pt-8">
          {changelogEntries.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="system-card p-6 sm:p-8"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-text-muted mb-2">
                {entry.date}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-mono uppercase tracking-wider text-accent mb-4">
                {entry.badge}
              </span>
              <h2 className="font-mono text-xl font-semibold text-text-primary sm:text-2xl mb-4">
                {entry.title}
              </h2>
              <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8">
          <Link href="/newsletter" className="btn-primary">
            <span className="relative z-20 font-mono">SUBSCRIBE FOR UPDATES</span>
          </Link>
          <Link href="/" className="btn-secondary">
            <span className="relative z-20 font-mono">BACK HOME</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

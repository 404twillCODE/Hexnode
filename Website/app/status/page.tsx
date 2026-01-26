import Link from "next/link";

export default function StatusPage() {
  return (
    <section className="full-width-section relative">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            STATUS
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            All systems operational. No incidents reported.
          </p>
        </div>
        <div className="space-y-4 border-t border-border pt-8 text-sm text-text-secondary sm:text-base">
          <div>
            <span className="text-text-primary">Website:</span> Online
          </div>
          <div>
            <span className="text-text-primary">Desktop App:</span> Pre-release development
          </div>
          <div>
            <span className="text-text-primary">Launcher:</span> Planned
          </div>
          <div>
            <span className="text-text-primary">Recycle Hosting:</span> Planned
          </div>
          <div>
            <span className="text-text-primary">Premium Hosting:</span> Planned
          </div>
          <div>
            <span className="text-text-primary">Community:</span> Online
          </div>
        </div>
        <p className="mt-6 text-xs text-text-muted">
          Last updated: Manual updates during pre-release.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://discord.gg/RVTAEbdDBJ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-discord"
          >
            <span className="relative z-20 font-mono">JOIN DISCORD</span>
          </a>
          <Link href="/" className="btn-secondary">
            <span className="relative z-20 font-mono">BACK HOME</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


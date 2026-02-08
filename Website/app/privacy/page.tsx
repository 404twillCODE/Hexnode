import Link from "next/link";

export default function PrivacyPage() {
  return (
    <section className="full-width-section relative bg-background-secondary">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            PRIVACY
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Nodexity is local first. We do not collect your server data, and
            your worlds and configurations remain on your machine by default.
          </p>
        </div>
        <div className="space-y-6 border-t border-border pt-8 text-sm text-text-secondary sm:text-base">
          <div>
            <span className="text-text-primary">Data collection:</span> None from the desktop app by default.
          </div>
          <div>
            <span className="text-text-primary">Local storage:</span> All server data stays on your machine.
          </div>
          <div>
            <span className="text-text-primary">Analytics:</span> The website does not use third-party trackers.
          </div>
          <div>
            <span className="text-text-primary">Contact:</span> If you have concerns, reach out in Discord.
          </div>
          <div className="text-text-muted">
            This policy is a pre-release summary and will be expanded before public launch.
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn-secondary">
            <span className="relative z-20 font-mono">BACK HOME</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


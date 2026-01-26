import Link from "next/link";

export default function DonatePage() {
  return (
    <section className="full-width-section relative bg-background-secondary">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            DONATE
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Donation links are coming soon. If you want to support Hexnode
            before release, the best way right now is to join Discord and share
            feedback or star the GitHub repo.
          </p>
        </div>
        <div className="space-y-3 border-t border-border pt-8 text-sm text-text-secondary sm:text-base">
          <div>GitHub Sponsors: Coming soon</div>
          <div>Ko-fi: Coming soon</div>
          <div>PayPal: Coming soon</div>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://github.com/404twillCODE/Hexnode"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <span className="relative z-20 font-mono">GITHUB</span>
          </a>
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


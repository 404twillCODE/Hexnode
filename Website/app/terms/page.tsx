import Link from "next/link";

export default function TermsPage() {
  return (
    <section className="full-width-section relative">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            TERMS
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            These pre-release terms describe how the project can be used while
            Nodexity is still in development.
          </p>
        </div>
        <div className="space-y-6 border-t border-border pt-8 text-sm text-text-secondary sm:text-base">
          <div>
            <span className="text-text-primary">Pre-release software:</span> Features may change or break without notice.
          </div>
          <div>
            <span className="text-text-primary">Use at your own risk:</span> Always back up worlds and configs.
          </div>
          <div>
            <span className="text-text-primary">No warranty:</span> The software is provided as-is.
          </div>
          <div>
            <span className="text-text-primary">Feedback:</span> By posting feedback, you allow us to use it to improve Nodexity.
          </div>
          <div className="text-text-muted">
            Full terms will be published before public launch.
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


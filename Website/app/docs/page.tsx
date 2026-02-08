import Link from "next/link";

export default function DocsPage() {
  return (
    <section className="full-width-section relative bg-background-secondary">
      <div className="section-content mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-mono">
            DOCUMENTATION
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Nodexity is a local first Minecraft server management platform. This
            page mirrors the current README and will expand as features stabilize.
          </p>
        </div>

        <div className="space-y-10 border-t border-border pt-8 text-sm text-text-secondary sm:text-base">
          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              Overview
            </h2>
            <p className="mt-2 leading-relaxed">
              Nodexity provides a desktop app for Minecraft server creation and
              management, a planned launcher, and future hosting infrastructure.
              All data remains local and portable by default.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              Project Structure
            </h2>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-text-primary">/App</span> — Desktop application (Electron + React)
              </div>
              <div>
                <span className="text-text-primary">/Website</span> — Marketing/landing site (Next.js)
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              Current Status
            </h2>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-text-primary">In Development:</span> Website, Server Manager
              </div>
              <div>
                <span className="text-text-primary">Planned:</span> Launcher, Premium Hosting, Recycle Hosting
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              Run the Desktop App (Development)
            </h2>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-text-primary">Prerequisites:</span> Node.js (v20+), npm or yarn, Java
              </div>
              <div className="rounded border border-border bg-background px-4 py-3 font-mono text-xs text-text-primary">
                git clone https://github.com/404twillCODE/Nodexity.git
                <br />
                cd Nodexity/App
                <br />
                npm install
                <br />
                npm run dev
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              Run the Website (Development)
            </h2>
            <div className="mt-2 rounded border border-border bg-background px-4 py-3 font-mono text-xs text-text-primary">
              cd Nodexity/Website
              <br />
              npm install
              <br />
              npm run dev
            </div>
            <p className="mt-2 text-text-muted">Website runs on port 4000.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              License
            </h2>
            <div className="mt-2 space-y-1">
              <div>
                <span className="text-text-primary">App:</span> AGPL-3.0
              </div>
              <div>
                <span className="text-text-primary">Website:</span> MIT
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://github.com/404twillCODE/Nodexity"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <span className="relative z-20 font-mono">GITHUB README</span>
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


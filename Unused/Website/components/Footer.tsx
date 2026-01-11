import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-foreground/10 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-8">
          {/* Left side - Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="HEXNODE Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-semibold text-foreground">
                HEXNODE
              </span>
            </div>
            <p className="text-sm text-muted">
              Resources, not restrictions.
            </p>
          </div>

          {/* Right side - Link columns */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Column 1 - Product */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Product
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/pricing"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
                <Link
                  href="/status"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Status
                </Link>
              </div>
            </div>

            {/* Column 2 - Company */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Company
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/legal"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Legal
                </Link>
              </div>
            </div>

            {/* Column 3 - Developers */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Developers
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/github"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="/api"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  API
                </Link>
                <Link
                  href="/panel"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Panel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row - Copyright */}
        <div className="pt-8 border-t border-foreground/10">
          <p className="text-sm text-muted text-center">
            © {currentYear} HEXNODE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


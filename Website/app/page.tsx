"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const sectionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
};

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <motion.h1
            {...fadeInUp}
            className="text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl md:text-7xl"
          >
            HexNode
          </motion.h1>
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
          >
            Infrastructure management reimagined. Powerful, minimal, and built
            for developers who demand precision.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{
                boxShadow: "0 0 16px rgba(46, 242, 162, 0.25)",
              }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href="/dashboard"
                className="block rounded border border-accent/30 bg-accent/10 px-8 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/20"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ opacity: 0.9 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href="/docs"
                className="block rounded border border-border px-8 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              >
                Documentation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Software Overview Section */}
      <AnimatedSection className="border-y border-border bg-background-secondary">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                Software
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
                Deploy and manage your applications with ease. Our platform
                provides the tools you need to run your software stack
                efficiently, with monitoring, scaling, and management all in
                one place.
              </p>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Automated deployment pipelines
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Real-time monitoring and alerts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Resource scaling and optimization
                  </span>
                </li>
              </ul>
            </div>
            <motion.div
              whileHover={{
                y: -4,
              }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="rounded border border-border bg-background p-8"
            >
              <div className="space-y-4">
                <div className="h-4 w-3/4 rounded bg-border"></div>
                <div className="h-4 w-full rounded bg-border"></div>
                <div className="h-4 w-5/6 rounded bg-border"></div>
                <div className="mt-6 flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <div className="h-2 w-2 rounded-full bg-border"></div>
                  <div className="h-2 w-2 rounded-full bg-border"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Hosting Overview Section */}
      <AnimatedSection className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <motion.div
                whileHover={{
                  y: -4,
                }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="rounded border border-border bg-background p-8 opacity-50"
              >
                <div className="space-y-4">
                  <div className="h-4 w-3/4 rounded bg-border"></div>
                  <div className="h-4 w-full rounded bg-border"></div>
                  <div className="h-4 w-5/6 rounded bg-border"></div>
                </div>
              </motion.div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-block rounded border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
                Coming Soon
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                Hosting
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
                Enterprise-grade hosting infrastructure designed for
                performance and reliability. Deploy your applications on our
                global network with automatic scaling and redundancy.
              </p>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Global edge network deployment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Automatic failover and redundancy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Built-in CDN and DDoS protection
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* USB Server Overview Section */}
      <AnimatedSection className="border-b border-border bg-background-secondary">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                USB Server
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
                Remotely access and manage USB devices over the network. Share
                USB peripherals across your infrastructure with secure,
                low-latency connections.
              </p>
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Network-based USB device sharing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Low-latency remote access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">→</span>
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    Secure device management
                  </span>
                </li>
              </ul>
            </div>
            <motion.div
              whileHover={{
                y: -4,
              }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="rounded border border-border bg-background p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="h-3 w-3 rounded-full bg-accent"></div>
                  <div className="h-4 flex-1 rounded bg-border"></div>
                </div>
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="h-3 w-3 rounded-full bg-border"></div>
                  <div className="h-4 flex-1 rounded bg-border"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-border"></div>
                  <div className="h-4 flex-1 rounded bg-border"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Vision / Philosophy Section */}
      <AnimatedSection className="border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Built for Developers
            </h2>
            <p className="mt-6 text-base leading-relaxed text-text-secondary sm:text-lg">
              HexNode is built on the principle that infrastructure management
              should be powerful yet simple. We believe in minimal interfaces,
              clear abstractions, and giving developers the control they need
              without the complexity they don't.
            </p>
            <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
              Every feature is designed with precision and purpose. No bloat, no
              unnecessary complexity—just the tools you need to build and deploy
              with confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-8 border-t border-border pt-10">
              <div className="text-center">
                <div className="text-2xl font-semibold text-accent sm:text-3xl">99.9%</div>
                <div className="mt-1.5 text-xs text-text-muted sm:text-sm">Uptime SLA</div>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-accent sm:text-3xl">24/7</div>
                <div className="mt-1.5 text-xs text-text-muted sm:text-sm">Monitoring</div>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-accent sm:text-3xl">API</div>
                <div className="mt-1.5 text-xs text-text-muted sm:text-sm">First Design</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

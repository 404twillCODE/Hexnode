"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function NewsletterPage() {
  return (
    <section className="full-width-section relative min-h-[70vh] flex items-center">
      <div className="section-content mx-auto w-full max-w-xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-mono mb-8"
          >
            ← Back to Overview
          </Link>
          <h1 className="font-mono text-3xl font-semibold uppercase tracking-wider text-text-primary sm:text-4xl lg:text-5xl">
            Stay Updated
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Get notified about launches, updates, and early access.
          </p>

          <div className="mt-10 system-card p-8 text-left">
            <NewsletterSignup />
            <p className="mt-6 text-xs text-text-muted border-t border-border pt-6">
              Newsletter delivery coming soon — your email will be saved when we launch the
              service.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/changelog" className="btn-secondary">
              <span className="relative z-20 font-mono">View changelog</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

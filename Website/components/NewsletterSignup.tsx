"use client";

import { useState } from "react";

type NewsletterSignupProps = {
  /** Optional compact layout for embedding in other pages */
  compact?: boolean;
  /** Optional custom class for the wrapper */
  className?: string;
};

export default function NewsletterSignup({ compact = false, className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={`rounded-xl border border-accent/30 bg-accent/10 p-6 text-center ${className}`}
      >
        <p className="font-mono text-sm font-medium text-accent sm:text-base">
          Thanks! We&apos;ll be in touch.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Newsletter delivery coming soon — your email will be saved when we launch the service.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className={compact ? "flex flex-col sm:flex-row gap-3" : "space-y-4"}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border-2 border-border bg-background-secondary px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 sm:flex-1"
          autoComplete="email"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          <span className="relative z-20 font-mono">
            {compact ? "Subscribe" : "Notify me"}
          </span>
        </button>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

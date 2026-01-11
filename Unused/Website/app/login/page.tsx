'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeUp,
  fadeUpTransition,
  staggerContainer,
  buttonHover,
  buttonTap,
} from "@/components/motionVariants";

export default function LoginPage() {
  return (
    <div className="pt-16 min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="flex flex-col gap-8"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div
            className="text-center"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Sign in to HEXNODE
            </h1>
            <p className="text-muted">
              Access your infrastructure.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            className="flex flex-col gap-6"
            variants={fadeUp}
            transition={fadeUpTransition}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              className="w-full px-4 py-3 bg-accent text-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Sign In
            </motion.button>
          </motion.form>

          {/* Register Link */}
          <motion.div
            className="text-center"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}


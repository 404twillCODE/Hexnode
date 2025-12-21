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

export default function NotFound() {
  return (
    <div className="pt-16 min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-2xl text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          className="flex flex-col gap-6 items-center"
          variants={staggerContainer}
        >
          {/* Large 404 Heading */}
          <motion.h1
            className="text-8xl font-bold text-foreground"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-3xl font-semibold text-foreground"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            Page not found
          </motion.h2>

          {/* Supporting Text */}
          <motion.p
            className="text-lg text-muted max-w-md"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            The resource you're looking for doesn't exist or has moved.
          </motion.p>

          {/* Actions */}
          <motion.div
            className="flex flex-col items-center gap-4 mt-4"
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <motion.div
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Link
                href="/"
                className="px-8 py-3 bg-accent text-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors block"
              >
                Back to Home
              </Link>
            </motion.div>
            <Link
              href="/pricing"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Go to Pricing
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}


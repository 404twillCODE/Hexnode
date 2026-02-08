'use client';

import { motion } from "framer-motion";
import {
  fadeUp,
  fadeUpTransition,
  staggerContainer,
} from "@/components/motionVariants";

export default function DocsPage() {
  return (
    <div className="pt-16">
      {/* Page Header */}
      <section className="w-full py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-5xl font-bold text-foreground mb-4"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              Documentation
            </motion.h1>
            <motion.p
              className="text-xl text-muted"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              Everything you need to build and manage your infrastructure.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="w-full py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <p className="text-lg text-muted leading-relaxed text-center">
              NODEXITY documentation will cover resource pools, server management, performance tuning, and advanced infrastructure concepts. Full documentation is coming soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Grid */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Getting Started */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg hover:border-foreground/20 transition-colors"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Getting Started
              </h3>
              <p className="text-muted leading-relaxed">
                Learn how resource pools work and deploy your first servers.
              </p>
            </motion.div>

            {/* Server Management */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg hover:border-foreground/20 transition-colors"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Server Management
              </h3>
              <p className="text-muted leading-relaxed">
                Create, configure, and scale Minecraft servers within your pool.
              </p>
            </motion.div>

            {/* Resource Model */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg hover:border-foreground/20 transition-colors"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Resource Model
              </h3>
              <p className="text-muted leading-relaxed">
                Understand how CPU, RAM, and storage are allocated and shared.
              </p>
            </motion.div>

            {/* Advanced Topics */}
            <motion.div
              className="p-6 border border-foreground/10 rounded-lg hover:border-foreground/20 transition-colors"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Advanced Topics
              </h3>
              <p className="text-muted leading-relaxed">
                Performance tuning, custom builds, and infrastructure concepts.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="w-full py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <p className="text-sm text-muted">
              Documentation is actively being developed.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


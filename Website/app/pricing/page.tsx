'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeUp,
  fadeUpTransition,
  staggerContainer,
  buttonHover,
  buttonTap,
  buttonTransition,
} from "@/components/motionVariants";

export default function PricingPage() {
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
              Pricing
            </motion.h1>
            <motion.p
              className="text-xl text-muted"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              Simple resource-based pricing. No per-server limits.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="w-full py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {/* Tier 1: Starter */}
            <motion.div
              className="flex flex-col gap-4 p-6 border border-foreground/10 rounded-lg"
              variants={fadeUp}
              transition={fadeUpTransition}
              whileHover={{
                scale: 1.01,
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Starter
                </h3>
                <div className="text-3xl font-bold text-foreground">
                  $8 <span className="text-lg font-normal text-muted">/ month</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-foreground/10">
                <p className="text-foreground">4 GB RAM</p>
                <p className="text-foreground">Shared CPU</p>
                <p className="text-foreground">50 GB Storage</p>
              </div>
              <p className="text-muted text-sm leading-relaxed mt-2">
                Perfect for small networks, proxies, or test environments.
              </p>
            </motion.div>

            {/* Tier 2: Pro (Highlighted) */}
            <motion.div
              className="flex flex-col gap-4 p-6 border-2 border-accent rounded-lg"
              variants={fadeUp}
              transition={{ ...fadeUpTransition, delay: 0.2 }}
              initial={{ scale: 1.01 }}
              whileHover={{
                scale: 1.02,
                borderColor: "#8B5CF6",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
              }}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Pro
                </h3>
                <div className="text-3xl font-bold text-foreground">
                  $14 <span className="text-lg font-normal text-muted">/ month</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-foreground/10">
                <p className="text-foreground">8 GB RAM</p>
                <p className="text-foreground">Shared CPU</p>
                <p className="text-foreground">100 GB Storage</p>
              </div>
              <p className="text-muted text-sm leading-relaxed mt-2">
                Ideal for growing networks and multiple game modes.
              </p>
            </motion.div>

            {/* Tier 3: Power */}
            <motion.div
              className="flex flex-col gap-4 p-6 border border-foreground/10 rounded-lg"
              variants={fadeUp}
              transition={fadeUpTransition}
              whileHover={{
                scale: 1.01,
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Power
                </h3>
                <div className="text-3xl font-bold text-foreground">
                  $26 <span className="text-lg font-normal text-muted">/ month</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-foreground/10">
                <p className="text-foreground">16 GB RAM</p>
                <p className="text-foreground">Shared CPU</p>
                <p className="text-foreground">200 GB Storage</p>
              </div>
              <p className="text-muted text-sm leading-relaxed mt-2">
                For serious Minecraft infrastructure and modded servers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="w-full py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl font-bold text-foreground mb-8 text-center"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              What's Included
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
            >
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">Unlimited Minecraft servers per pool</p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">Any Minecraft software (Paper, Fabric, Forge, proxies, modpacks)</p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">Full file access (mods, plugins, configs)</p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">Dynamic CPU sharing</p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">Resource reallocation at any time</p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-1"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <p className="text-foreground">No artificial limits</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What You Pay For */}
      <section className="w-full py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              You pay for resources, not servers. Run one large server or many smaller ones — it's entirely up to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl font-bold text-foreground"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              Ready to build your infrastructure?
            </motion.h2>
            <motion.div
              variants={fadeUp}
              transition={fadeUpTransition}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Link
                href="/register"
                className="px-8 py-3 bg-accent text-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors block"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


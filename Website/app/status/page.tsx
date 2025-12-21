'use client';

import { motion } from "framer-motion";
import {
  fadeUp,
  fadeUpTransition,
  staggerContainer,
} from "@/components/motionVariants";

export default function StatusPage() {
  const services = [
    { name: 'Website', status: 'Operational' },
    { name: 'Control Panel', status: 'Operational' },
    { name: 'Node Infrastructure', status: 'Operational' },
    { name: 'API', status: 'Operational' },
  ];

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
              System Status
            </motion.h1>
            <motion.p
              className="text-xl text-muted"
              variants={fadeUp}
              transition={fadeUpTransition}
            >
              Current operational status of HEXNODE services.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Overall Status */}
      <section className="w-full py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="flex items-center justify-center gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={fadeUpTransition}
          >
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <p className="text-lg text-foreground font-medium">
              All systems operational
            </p>
          </motion.div>
        </div>
      </section>

      {/* Status List */}
      <section className="w-full py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="flex flex-col gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="flex items-center justify-between p-4 border border-foreground/10 rounded-lg"
                variants={fadeUp}
                transition={fadeUpTransition}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-foreground font-medium">
                    {service.name}
                  </span>
                </div>
                <span className="text-muted">
                  {service.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Note */}
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
              Live monitoring and historical uptime reporting coming soon.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


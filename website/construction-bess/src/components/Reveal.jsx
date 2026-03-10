import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Small utility wrapper for on-scroll entrance animations.
 *
 * Usage:
 *  <Reveal>
 *    <YourContent />
 *  </Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.55,
  y = 22,
  once = true,
  margin = "-80px",
  className,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

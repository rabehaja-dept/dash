/**
 * This component is used to animate page transitions
 * using the Framer Motion library and can be customized
 * to your liking.
 * @see https://www.framer.com/docs/animate-presence/
 */
import { useLocation } from "@remix-run/react";
import { motion } from "framer-motion";

export function Transition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      key={useLocation().pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42 }}
    >
      {children}
    </motion.main>
  );
}

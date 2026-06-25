import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type Location, useLocation } from "react-router-dom";
import { pageVariants } from "@/lib/motion";

interface RouteTransitionProps {
  children: (location: Location) => ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        data-route-path={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children(location)}
      </motion.div>
    </AnimatePresence>
  );
}

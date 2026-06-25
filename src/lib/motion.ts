import type { Transition, Variants } from "motion/react";

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: "easeOut" },
  },
};

export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: easeOut },
  },
};

export const listVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.045, delayChildren: 0.03 },
  },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: easeOut },
  },
};

export const collapseVariants: Variants = {
  closed: { height: 0, opacity: 0, overflow: "hidden" },
  open: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: {
      height: { duration: 0.26, ease: easeOut },
      opacity: { duration: 0.2 },
    },
  },
};

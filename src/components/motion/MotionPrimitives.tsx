import type { PropsWithChildren } from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import {
  collapseVariants,
  itemVariants,
  listVariants,
  pageVariants,
  sectionVariants,
} from "@/lib/motion";

type DivProps = HTMLMotionProps<"div">;

export function MotionPage({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div
      data-motion-role="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div
      data-motion-role="section"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionList({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div
      data-motion-role="list"
      variants={listVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div data-motion-role="item" variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

export function MotionCollapse({
  open,
  children,
  ...props
}: PropsWithChildren<DivProps & { open: boolean }>) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="motion-collapse"
          data-motion-role="collapse"
          variants={collapseVariants}
          initial="closed"
          animate="open"
          exit="closed"
          {...props}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MotionSurface({ children, ...props }: PropsWithChildren<DivProps>) {
  return (
    <motion.div
      data-motion-role="surface"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

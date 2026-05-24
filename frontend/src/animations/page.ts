export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
} as const;

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
} as const;

export const rise = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 }
} as const;

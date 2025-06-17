import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function TextShimmer({
  children,
  className,
  duration = 1,
}: TextShimmerProps) {
  return (
    <div className={cn("relative w-fit", className)}>
      <motion.span
        initial={{ opacity: 0.25 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration,
          ease: "easeInOut",
        }}
        className="inline-flex"
      >
        {children}
      </motion.span>
    </div>
  );
} 
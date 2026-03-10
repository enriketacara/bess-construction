import { motion } from "motion/react";

interface ServiceBadgeProps {
  service: string;
  variant?: "default" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function ServiceBadge({
  service,
  variant = "default",
  size = "md",
}: ServiceBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const variantClasses = {
    default:
      "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20",
    gradient:
      "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-none",
    outline: "bg-transparent border-2 border-purple-500/50 hover:bg-purple-500/10",
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center rounded-lg font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {service}
    </motion.span>
  );
}

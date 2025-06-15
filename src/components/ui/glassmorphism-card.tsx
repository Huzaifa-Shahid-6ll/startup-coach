
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export const GlassmorphismCard = ({ 
  children, 
  className, 
  gradient = false,
  animate = true,
  onClick
}: GlassmorphismCardProps) => {
  const cardContent = (
    <div 
      className={cn(
        "relative backdrop-blur-xl bg-white/3 border border-white/10 rounded-2xl",
        "shadow-2xl shadow-black/40",
        gradient && "startup-card",
        "hover:bg-white/5 transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-r before:from-blue-500/30 before:via-purple-500/30 before:to-pink-500/30",
        "before:-z-10 hover:before:from-blue-400/50 hover:before:via-purple-400/50 hover:before:to-pink-400/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10 h-full w-full rounded-2xl bg-slate-950/60 backdrop-blur-xl p-6">
        {children}
      </div>
    </div>
  );

  if (!animate) return cardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {cardContent}
    </motion.div>
  );
};


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
        "relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl",
        "shadow-2xl shadow-black/20",
        gradient && "bg-gradient-to-br from-white/10 to-white/5",
        "hover:bg-white/10 transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-r before:from-purple-500/50 before:via-pink-500/50 before:to-cyan-500/50",
        "before:-z-10 hover:before:from-purple-400 hover:before:via-pink-400 hover:before:to-cyan-400",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10 h-full w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl p-6">
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


import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const GradientButton = ({ 
  children, 
  onClick, 
  className,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md'
}: GradientButtonProps) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25",
    secondary: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/25",
    success: "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg shadow-green-500/25"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
    </motion.button>
  );
};

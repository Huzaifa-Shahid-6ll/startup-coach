
import { motion } from 'framer-motion';

export const GradientBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main dark background with startup theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/10 to-slate-950" />
      
      {/* Animated gradient orbs - Startup Coach theme */}
      <motion.div
        className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 25, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/15 to-cyan-400/15 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }}
      />
      
      {/* Startup Coach flowing ribbons */}
      <motion.div
        className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-transparent via-blue-500/40 via-purple-500/40 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-full h-3 bg-gradient-to-r from-transparent via-pink-500/40 via-cyan-500/40 to-transparent"
        animate={{
          x: ["100%", "-100%"]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 7
        }}
      />
      
      {/* Diagonal flowing lines for extra startup energy */}
      <motion.div
        className="absolute top-1/4 -left-1/4 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rotate-45"
        animate={{
          x: ["-50%", "150%"]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
      />
    </div>
  );
};

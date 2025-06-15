
import { motion } from 'framer-motion';

export const GradientBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Gradient flow ribbons */}
      <motion.div
        className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
        animate={{
          x: ["100%", "-100%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
      />
    </div>
  );
};

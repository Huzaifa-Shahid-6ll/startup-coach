
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useIdeas } from '@/hooks/useIdeas';
import { Lightbulb, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

export const SavedIdeas = () => {
  const { ideas, loading } = useIdeas();

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassmorphismCard className="text-center p-12">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-2xl font-bold gradient-text mb-4">No saved ideas yet</h3>
          <p className="text-gray-400 text-lg">Start by analyzing your first idea to see the magic happen!</p>
        </GlassmorphismCard>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.h3 
        className="text-4xl font-bold gradient-text mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Saved Ideas
      </motion.h3>
      
      <div className="grid gap-6">
        {ideas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassmorphismCard className="hover:border-purple-400/50 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                      {idea.title}
                    </h4>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(idea.created_at), 'MMM d, yyyy')}
                    </div>
                    
                    {idea.rating && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border border-purple-400/30"
                        >
                          ⭐ {idea.rating}/10
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

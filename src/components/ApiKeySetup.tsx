
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Check } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

// Hardcoded API keys for different models
const API_KEYS = {
  model1: 'sk-or-v1-your-first-openrouter-api-key-here',
  model2: 'sk-or-v1-your-second-openrouter-api-key-here', 
  model3: 'sk-or-v1-your-third-openrouter-api-key-here'
};

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigureApiKeys = () => {
    setIsConfiguring(true);
    
    // Save the API keys to localStorage with different identifiers
    localStorage.setItem('OPENROUTER_API_KEY_MODEL1', API_KEYS.model1);
    localStorage.setItem('OPENROUTER_API_KEY_MODEL2', API_KEYS.model2);
    localStorage.setItem('OPENROUTER_API_KEY_MODEL3', API_KEYS.model3);
    
    // Also save the primary key for backward compatibility
    localStorage.setItem('VITE_OPENROUTER_API_KEY', API_KEYS.model1);
    
    setTimeout(() => {
      toast({
        title: "API Keys Configured! 🔑",
        description: "All OpenRouter API keys have been set up successfully.",
      });
      setIsConfiguring(false);
      onApiKeySet();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <GlassmorphismCard className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">AI API Configuration</h2>
          <p className="text-gray-300">
            Setting up your AI models with pre-configured API keys.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Ready to Configure</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Model 1: Primary analysis model configured</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Model 2: Secondary validation model configured</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Model 3: Advanced reasoning model configured</span>
              </div>
            </div>
            
            <GradientButton
              onClick={handleConfigureApiKeys}
              className="w-full"
              disabled={isConfiguring}
              loading={isConfiguring}
            >
              {isConfiguring ? "Configuring..." : "Configure AI Models"}
            </GradientButton>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">🚀 Multiple AI Models</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Three different models for comprehensive analysis</li>
              <li>• Optimized for different types of business insights</li>
              <li>• Automatic load balancing and fallback support</li>
              <li>• All keys are securely stored locally</li>
            </ul>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  );
};

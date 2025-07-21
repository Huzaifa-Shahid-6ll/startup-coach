
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Check } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

// Hardcoded API keys for different tiers
const API_KEYS = {
  free: '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', // tngtech/deepseek-r1t2-chimera:free
  pro: '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',  // OpenAI o3-mini
  ultra: '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'  // openai/gpt-4o:extended
};

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigureApiKeys = () => {
    setIsConfiguring(true);
    
    // Save the API keys to localStorage with tier-based identifiers
    localStorage.setItem('OPENROUTER_API_KEY_FREE', API_KEYS.free);
    localStorage.setItem('OPENROUTER_API_KEY_PRO', API_KEYS.pro);
    localStorage.setItem('OPENROUTER_API_KEY_ULTRA', API_KEYS.ultra);
    
    // Set the default key for backward compatibility (free tier)
    localStorage.setItem('VITE_OPENROUTER_API_KEY', API_KEYS.free);
    
    setTimeout(() => {
      toast({
        title: "AI Models Configured! 🚀",
        description: "All tier-based AI models have been set up successfully.",
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
          <h2 className="text-3xl font-bold gradient-text mb-4">AI Tier Configuration</h2>
          <p className="text-gray-300">
            Setting up your tiered AI models with specialized capabilities.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Tier-Based AI Models</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                <span>Free Tier: DeepSeek R1 Chimera (5,000 tokens/month)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-blue-400" />
                <span>PRO Tier: OpenAI o3-mini (20,000 tokens/month)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-purple-400" />
                <span>ULTRA Tier: GPT-4o Extended (50,000 tokens/month)</span>
              </div>
            </div>
            
            <GradientButton
              onClick={handleConfigureApiKeys}
              className="w-full"
              disabled={isConfiguring}
              loading={isConfiguring}
            >
              {isConfiguring ? "Configuring..." : "Configure AI Tiers"}
            </GradientButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-green-400 font-semibold mb-2">🆓 Free Tier</h4>
              <ul className="text-green-300 text-sm space-y-1">
                <li>• DeepSeek R1 Chimera</li>
                <li>• 5,000 tokens/month</li>
                <li>• Basic analysis</li>
                <li>• $0/month</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-400 font-semibold mb-2">💎 PRO Tier</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• OpenAI o3-mini</li>
                <li>• 20,000 tokens/month</li>
                <li>• Advanced reasoning</li>
                <li>• $25/month</li>
              </ul>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <h4 className="text-purple-400 font-semibold mb-2">🚀 ULTRA Tier</h4>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• GPT-4o Extended</li>
                <li>• 50,000 tokens/month</li>
                <li>• Premium capabilities</li>
                <li>• $125/month</li>
              </ul>
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  );
};

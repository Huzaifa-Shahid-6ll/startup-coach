
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ExternalLink, Copy, Check } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      // Save to localStorage with the exact key name that getApiKey() checks for
      localStorage.setItem('VITE_OPENROUTER_API_KEY', apiKey.trim());
      toast({
        title: "API Key Saved! 🔑",
        description: "Your OpenRouter API key has been saved locally and will persist across sessions.",
      });
      onApiKeySet();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenRouter API key.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
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
          <h2 className="text-3xl font-bold gradient-text mb-4">Setup OpenRouter API</h2>
          <p className="text-gray-300">
            To analyze your ideas with AI, you'll need a free OpenRouter API key.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Step 1: Get Your Free API Key</h3>
            <div className="space-y-3">
              <p className="text-gray-300">1. Visit OpenRouter and create a free account:</p>
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                <code className="text-purple-300 flex-1">https://openrouter.ai</code>
                <button
                  onClick={() => copyToClipboard('https://openrouter.ai')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-300">2. Go to your API Keys section</p>
              <p className="text-gray-300">3. Create a new API key</p>
              <p className="text-gray-300">4. Copy your API key and paste it below</p>
            </div>
            
            <GradientButton
              onClick={() => window.open('https://openrouter.ai', '_blank')}
              className="w-full"
              variant="secondary"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open OpenRouter.ai
            </GradientButton>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Step 2: Enter Your API Key</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-white text-sm font-medium">
                  OpenRouter API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="gradient-input mt-2"
                />
              </div>
              
              <GradientButton
                onClick={handleSaveApiKey}
                className="w-full"
                disabled={!apiKey.trim()}
              >
                Save API Key & Continue
              </GradientButton>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <h4 className="text-green-400 font-semibold mb-2">💡 Why OpenRouter?</h4>
            <ul className="text-green-300 text-sm space-y-1">
              <li>• Access to multiple free AI models</li>
              <li>• No credit card required for free tier</li>
              <li>• Better reliability than single model providers</li>
              <li>• Your API key is stored locally and never shared</li>
            </ul>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  );
};

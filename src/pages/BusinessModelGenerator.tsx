
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Users, TrendingUp, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { generateBusinessModel, BusinessModelResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';

export default function BusinessModelGenerator() {
  const [ideaText, setIdeaText] = useState("");
  const [businessModel, setBusinessModel] = useState<BusinessModelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!ideaText.trim()) {
      toast({
        title: "Please enter an idea",
        description: "Describe your business idea to generate a model",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate business models",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateBusinessModel(ideaText);
      setBusinessModel(result);
      
      toast({
        title: "Business model generated!",
        description: "Your comprehensive business model is ready.",
      });
    } catch (error: any) {
      console.error('Business model generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center space-x-4">
              <GradientButton onClick={() => navigate('/dashboard')} variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </GradientButton>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                Business Model Generator
              </h1>
            </div>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <GlassmorphismCard className="p-8">
              <div className="text-center mb-8">
                <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Create Your Business Model
                </h2>
                <p className="text-xl text-gray-300">
                  Transform your idea into a comprehensive business strategy
                </p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                <Textarea
                  placeholder="Describe your business idea in detail..."
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  className="gradient-input min-h-32 text-lg"
                />
                
                <GradientButton
                  onClick={handleGenerate}
                  loading={loading}
                  disabled={!ideaText.trim() || loading}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {loading ? "Generating Model..." : "Generate Business Model"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results Section */}
          {businessModel && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold gradient-text text-center mb-12">Your Business Model</h3>

              {/* Value Proposition & Target Customer */}
              <div className="grid md:grid-cols-2 gap-8">
                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Target className="w-6 h-6 text-blue-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Value Proposition</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{businessModel.value_proposition}</p>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Users className="w-6 h-6 text-purple-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Target Customer</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{businessModel.target_customer}</p>
                  </div>
                </GlassmorphismCard>
              </div>

              {/* Revenue Streams */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <DollarSign className="w-6 h-6 text-green-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Revenue Streams</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {businessModel.revenue_streams?.map((stream: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-300">{stream}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Cost Structure */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <TrendingUp className="w-6 h-6 text-red-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Cost Structure</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {businessModel.cost_structure?.map((cost: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-gray-300">{cost}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Marketing Channels */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Marketing Channels</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {businessModel.marketing_channels?.map((channel: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Customer Acquisition */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-cyan-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Customer Acquisition Strategy</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{businessModel.customer_acquisition}</p>
                </div>
              </GlassmorphismCard>

              {/* Implementation Steps */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="w-6 h-6 text-blue-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Implementation Steps</h4>
                  </div>
                  <div className="space-y-4">
                    {businessModel.implementation_steps?.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Key Metrics */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Target className="w-6 h-6 text-green-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Key Metrics to Track</h4>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessModel.key_metrics?.map((metric: string, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-400/30">
                        <p className="text-green-300 font-medium">{metric}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Action Buttons */}
              <div className="text-center pt-8">
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <GradientButton 
                    onClick={() => setIdeaText("")}
                    variant="secondary"
                    className="px-8 py-3"
                  >
                    Generate Another Model
                  </GradientButton>
                  <GradientButton 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3"
                  >
                    Back to Dashboard
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

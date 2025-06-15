
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, BarChart3, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { validateNiche, NicheValidationResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';

export default function NicheValidation() {
  const [nicheText, setNicheText] = useState("");
  const [validation, setValidation] = useState<NicheValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleValidate = async () => {
    if (!nicheText.trim()) {
      toast({
        title: "Please enter a niche",
        description: "Describe your niche to get validation insights",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to validate niches",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await validateNiche(nicheText);
      setValidation(result);
      
      toast({
        title: "Validation complete!",
        description: "Your niche analysis is ready.",
      });
    } catch (error: any) {
      console.error('Niche validation error:', error);
      toast({
        title: "Validation failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getViabilityColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getViabilityText = (score: number) => {
    if (score >= 8) return "🚀 Highly Viable";
    if (score >= 6) return "⚡ Moderately Viable";
    return "⚠️ Needs Work";
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
                Niche Validation
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
                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Validate Your Niche
                </h2>
                <p className="text-xl text-gray-300">
                  Get deep market insights and validation for your target niche
                </p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                <Textarea
                  placeholder="Describe your target niche, market segment, or customer group..."
                  value={nicheText}
                  onChange={(e) => setNicheText(e.target.value)}
                  className="gradient-input min-h-32 text-lg"
                />
                
                <GradientButton
                  onClick={handleValidate}
                  loading={loading}
                  disabled={!nicheText.trim() || loading}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {loading ? "Analyzing Market..." : "Validate Niche"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results Section */}
          {validation && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold gradient-text text-center mb-12">Validation Results</h3>

              {/* Viability Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <GlassmorphismCard gradient>
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-white mb-6">Niche Viability Score</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Progress value={validation.viability_score * 10} className="h-4 mb-4" />
                        <p className={`text-lg font-medium ${getViabilityColor(validation.viability_score)}`}>
                          {getViabilityText(validation.viability_score)}
                        </p>
                      </div>
                      <div className={`text-6xl font-bold text-glow ml-8 ${getViabilityColor(validation.viability_score)}`}>
                        {validation.viability_score}/10
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>

              {/* Market Size & Revenue Opportunity */}
              <div className="grid md:grid-cols-2 gap-8">
                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Market Size</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{validation.market_size}</p>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="w-6 h-6 text-green-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Revenue Opportunity</h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{validation.revenue_opportunity}</p>
                  </div>
                </GlassmorphismCard>
              </div>

              {/* Demographics & Pricing Strategies */}
              <div className="grid md:grid-cols-2 gap-8">
                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <Users className="w-6 h-6 text-purple-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Target Demographics</h4>
                    </div>
                    <div className="space-y-3">
                      {validation.demographics?.map((demo: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <p className="text-gray-300">{demo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <DollarSign className="w-6 h-6 text-yellow-400 mr-3" />
                      <h4 className="text-2xl font-bold text-white">Pricing Strategies</h4>
                    </div>
                    <div className="space-y-3">
                      {validation.pricing_strategies?.map((strategy: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassmorphismCard>
              </div>

              {/* Entry Strategy */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-cyan-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Market Entry Strategy</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{validation.entry_strategy}</p>
                </div>
              </GlassmorphismCard>

              {/* Competitors */}
              <GlassmorphismCard>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Star className="w-6 h-6 text-red-400 mr-3" />
                    <h4 className="text-2xl font-bold text-white">Key Competitors</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {validation.competitors?.map((competitor: string, index: number) => (
                      <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-red-300 font-medium">{competitor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Action Buttons */}
              <div className="text-center pt-8">
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <GradientButton 
                    onClick={() => navigate('/business-model')}
                    className="px-8 py-3"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Generate Business Model
                  </GradientButton>
                  <GradientButton 
                    onClick={() => setNicheText("")}
                    variant="secondary"
                    className="px-8 py-3"
                  >
                    Validate Another Niche
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

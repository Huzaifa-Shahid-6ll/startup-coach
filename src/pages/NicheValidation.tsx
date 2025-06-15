
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, TrendingUp, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { validateNiche, NicheValidationResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function NicheValidation() {
  const [nicheDescription, setNicheDescription] = useState("");
  const [validation, setValidation] = useState<NicheValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (!nicheDescription.trim()) {
      toast({
        title: "Please describe your niche",
        description: "Tell us about the market or audience you want to target",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await validateNiche(nicheDescription);
      setValidation(result);
      
      toast({
        title: "Validation complete!",
        description: "Your niche analysis is ready.",
      });
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        title: "Validation failed",
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
            <div className="flex items-center">
              <GradientButton 
                onClick={() => navigate('/')}
                variant="secondary"
                className="mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </GradientButton>
              <h1 className="text-4xl md:text-6xl font-bold gradient-text flex items-center">
                <Users className="w-12 h-12 mr-4" />
                Niche Validation
              </h1>
            </div>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <GlassmorphismCard className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Validate Your Target Market
                </h2>
                <p className="text-xl text-gray-300">
                  Get AI-powered insights about your niche's potential and viability
                </p>
              </div>

              <div className="space-y-6">
                <Textarea
                  placeholder="Describe your target niche... (e.g., 'Small business owners who struggle with social media marketing', 'New parents looking for time management solutions')"
                  value={nicheDescription}
                  onChange={(e) => setNicheDescription(e.target.value)}
                  className="gradient-input min-h-32 text-lg"
                />
                
                <GradientButton
                  onClick={handleValidate}
                  loading={loading}
                  disabled={!nicheDescription.trim() || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Analyzing Niche..." : "Validate My Niche"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results */}
          {validation && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Market Score */}
              <GlassmorphismCard gradient>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 mr-3" />
                    Market Viability Score
                  </h3>
                  <div className="text-6xl font-bold gradient-text mb-4">
                    {validation.viabilityScore}/10
                  </div>
                  <Badge variant={validation.viabilityScore >= 7 ? "default" : validation.viabilityScore >= 5 ? "secondary" : "destructive"}>
                    {validation.viabilityScore >= 7 ? "High Potential" : 
                     validation.viabilityScore >= 5 ? "Moderate Potential" : "Needs Work"}
                  </Badge>
                </div>
              </GlassmorphismCard>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <GlassmorphismCard className="border-green-500/30">
                  <h4 className="text-green-400 text-xl font-bold flex items-center mb-4">
                    <Target className="w-6 h-6 mr-2" />
                    Market Size & Demand
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-4">{validation.marketSize}</p>
                  <div className="space-y-2">
                    <h5 className="text-white font-semibold">Key Demographics:</h5>
                    <ul className="space-y-1">
                      {validation.demographics.map((demo, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-300">{demo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard className="border-blue-500/30">
                  <h4 className="text-blue-400 text-xl font-bold flex items-center mb-4">
                    <DollarSign className="w-6 h-6 mr-2" />
                    Revenue Potential
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-4">{validation.revenueOpportunity}</p>
                  <div className="space-y-2">
                    <h5 className="text-white font-semibold">Pricing Strategies:</h5>
                    <ul className="space-y-1">
                      {validation.pricingStrategies.map((strategy, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-300">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard className="border-yellow-500/30">
                  <h4 className="text-yellow-400 text-xl font-bold flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    Challenges & Risks
                  </h4>
                  <ul className="space-y-3">
                    {validation.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-300">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphismCard>

                <GlassmorphismCard className="border-purple-500/30">
                  <h4 className="text-purple-400 text-xl font-bold flex items-center mb-4">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    Market Entry Strategy
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{validation.entryStrategy}</p>
                </GlassmorphismCard>
              </div>

              {/* Competition Analysis */}
              <GlassmorphismCard gradient>
                <h3 className="text-2xl font-bold gradient-text mb-6">Competition Landscape</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {validation.competitors.map((competitor, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h5 className="text-white font-semibold mb-2">{competitor.name}</h5>
                      <p className="text-gray-400 text-sm mb-2">{competitor.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {competitor.strength}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlassmorphismCard>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

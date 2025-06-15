
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowLeft, Zap, Users, Target, TrendingUp } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { generateBusinessModel, BusinessModelResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function BusinessModelGenerator() {
  const [idea, setIdea] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [businessModel, setBusinessModel] = useState<BusinessModelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please describe your business idea",
        description: "We need your business concept to generate a model",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateBusinessModel(idea, budget, timeline);
      setBusinessModel(result);
      
      toast({
        title: "Business model generated!",
        description: "Your comprehensive business model is ready.",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
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
                <DollarSign className="w-12 h-12 mr-4" />
                Business Model Generator
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
                  Create Your Business Model
                </h2>
                <p className="text-xl text-gray-300">
                  Generate a complete business model tailored to your idea and constraints
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Business Idea Description
                  </label>
                  <Textarea
                    placeholder="Describe your business idea in detail... (e.g., 'A subscription-based meal planning app for busy professionals')"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="gradient-input min-h-32 text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Available Budget (Optional)
                    </label>
                    <Input
                      placeholder="e.g., $5,000 or bootstrapped"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="gradient-input text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Launch Timeline (Optional)
                    </label>
                    <Input
                      placeholder="e.g., 3 months or ASAP"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="gradient-input text-lg"
                    />
                  </div>
                </div>
                
                <GradientButton
                  onClick={handleGenerate}
                  loading={loading}
                  disabled={!idea.trim() || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Generating Business Model..." : "Generate My Business Model"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results */}
          {businessModel && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Overview */}
              <GlassmorphismCard gradient>
                <h3 className="text-3xl font-bold gradient-text mb-6">Business Model Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Value Proposition</h4>
                    <p className="text-gray-300 leading-relaxed">{businessModel.valueProposition}</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-3">Target Customer</h4>
                    <p className="text-gray-300 leading-relaxed">{businessModel.targetCustomer}</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Revenue Streams */}
              <GlassmorphismCard className="border-green-500/30">
                <h3 className="text-green-400 text-2xl font-bold flex items-center mb-6">
                  <DollarSign className="w-6 h-6 mr-3" />
                  Revenue Streams
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {businessModel.revenueStreams.map((stream, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-xl border border-white/10"
                    >
                      <h5 className="text-white font-semibold mb-2">{stream.name}</h5>
                      <p className="text-gray-300 text-sm mb-2">{stream.description}</p>
                      <Badge variant="outline" className="text-green-300 border-green-400/50">
                        {stream.potential}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>

              {/* Cost Structure */}
              <GlassmorphismCard className="border-red-500/30">
                <h3 className="text-red-400 text-2xl font-bold flex items-center mb-6">
                  <Target className="w-6 h-6 mr-3" />
                  Cost Structure
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {businessModel.costStructure.map((cost, index) => (
                    <div key={index} className="p-4 bg-red-600/10 rounded-lg border border-red-500/20">
                      <h5 className="text-red-300 font-semibold mb-2">{cost.category}</h5>
                      <p className="text-gray-300 text-sm">{cost.description}</p>
                    </div>
                  ))}
                </div>
              </GlassmorphismCard>

              {/* Marketing Strategy */}
              <GlassmorphismCard className="border-blue-500/30">
                <h3 className="text-blue-400 text-2xl font-bold flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Marketing & Customer Acquisition
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Marketing Channels</h4>
                    <ul className="space-y-2">
                      {businessModel.marketingChannels.map((channel, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-300">{channel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Customer Acquisition Strategy</h4>
                    <p className="text-gray-300 leading-relaxed">{businessModel.customerAcquisition}</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Implementation Roadmap */}
              <GlassmorphismCard className="border-purple-500/30">
                <h3 className="text-purple-400 text-2xl font-bold flex items-center mb-6">
                  <Zap className="w-6 h-6 mr-3" />
                  Implementation Roadmap
                </h3>
                <div className="space-y-4">
                  {businessModel.implementationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start p-4 bg-purple-600/10 rounded-lg border border-purple-500/20"
                    >
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">{step.phase}</h5>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        <Badge variant="outline" className="text-purple-300 border-purple-400/50 text-xs">
                          {step.timeframe}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>

              {/* Key Metrics */}
              <GlassmorphismCard gradient>
                <h3 className="text-2xl font-bold gradient-text mb-6">Key Success Metrics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {businessModel.keyMetrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                      <h5 className="text-white font-semibold mb-2">{metric.name}</h5>
                      <p className="text-gray-400 text-sm">{metric.description}</p>
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

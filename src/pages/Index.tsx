
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Users, DollarSign, Target, BarChart3, Rocket, Brain, Bookmark, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AuthModal } from '@/components/AuthModal';
import { SavedIdeas } from '@/components/SavedIdeas';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { useAuth } from '@/hooks/useAuth';
import { useIdeas } from '@/hooks/useIdeas';
import { analyzeIdea, IdeaAnalysisResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';

export default function Index() {
  const [ideaText, setIdeaText] = useState("");
  const [analysis, setAnalysis] = useState<IdeaAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const { user, loading: authLoading, signOut } = useAuth();
  const { saveIdea } = useIdeas();
  const navigate = useNavigate();

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('VITE_OPENROUTER_API_KEY');
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    const interval = setInterval(checkApiKey, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!ideaText.trim()) {
      toast({
        title: "Please enter an idea",
        description: "Describe your idea or skill to get started",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to analyze ideas",
        variant: "destructive"
      });
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    
    try {
      const result = await analyzeIdea(ideaText);
      setAnalysis(result);
      
      toast({
        title: "Analysis complete!",
        description: "Your idea has been analyzed successfully.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async () => {
    if (!analysis || !user) return;

    const ideaTitle = ideaText.slice(0, 100) + (ideaText.length > 100 ? "..." : "");
    
    const { error } = await saveIdea({
      title: ideaTitle,
      description: ideaText,
      rating: analysis.rating,
      swot_analysis: analysis.swot,
      niches: analysis.niches,
      digital_products: analysis.products,
      monetization_paths: analysis.monetization,
      mvp_recommendation: analysis.mvp
    });

    if (error) {
      toast({
        title: "Error saving idea",
        description: "Please try again",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Idea saved!",
        description: "Your analysis has been saved to your profile",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <GradientBackground />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-8 leading-tight">
              Turn Ideas Into
              <br />
              <span className="text-white">Digital Gold</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Get instant AI-powered analysis of your business ideas, discover profitable niches,
              <br />
              and build your path to digital success.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Lightbulb, text: "Idea Analysis" },
                { icon: TrendingUp, text: "Market Insights" },
                { icon: Users, text: "Niche Discovery" },
                { icon: DollarSign, text: "Monetization" },
                { icon: Target, text: "MVP Planning" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                    <feature.icon className="w-4 h-4 mr-2" />
                    {feature.text}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <GradientButton
              onClick={() => setAuthModalOpen(true)}
              size="lg"
              className="px-12 py-6 text-xl"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Analyzing Ideas
            </GradientButton>
          </motion.div>
        </div>

        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    );
  }

  if (!hasApiKey) {
    return (
      <>
        <GradientBackground />
        <div className="relative min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold gradient-text">
                IdeaForgeAI
              </h1>
              <GradientButton onClick={() => signOut()}>
                Sign Out
              </GradientButton>
            </motion.div>
            <ApiKeySetup onApiKeySet={() => setHasApiKey(true)} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none w-64"
                />
                <Target className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <GradientButton onClick={() => signOut()} variant="secondary">
                <User className="w-4 h-4 mr-2" />
                Account
              </GradientButton>
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-400 mb-8">Quick Links</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* New Idea Card */}
              <GlassmorphismCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">New Idea</h3>
                    <p className="text-gray-400 text-sm">Analyze your next big idea</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Saved Ideas Card */}
              <GlassmorphismCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Saved Ideas</h3>
                    <p className="text-gray-400 text-sm">View your saved analyses</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Clarity Coach Card */}
              <GlassmorphismCard 
                className="p-6 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/clarity-coach')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Clarity Coach</h3>
                    <p className="text-gray-400 text-sm">Get personalized guidance</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {/* Workspace Card */}
              <GlassmorphismCard 
                className="p-6 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate('/niche-validation')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Workspace</h3>
                    <p className="text-gray-400 text-sm">Niche validation tools</p>
                  </div>
                </div>
              </GlassmorphismCard>
            </div>
          </motion.div>

          {/* Main Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassmorphismCard className="p-8 md:p-12 mb-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Describe your idea or skill
                </h2>
                <p className="text-xl text-gray-300">
                  Get your AI report instantly
                </p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="relative">
                  <Textarea
                    placeholder="Describe your business idea, skill, or concept here..."
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    className="gradient-input min-h-32 text-lg pr-12"
                  />
                  <div className="absolute right-4 top-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <GradientButton
                  onClick={handleAnalyze}
                  loading={loading}
                  disabled={!ideaText.trim() || loading}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {loading ? "Generating..." : "Generate"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results Section */}
          {analysis && (
            <motion.div 
              className="max-w-6xl mx-auto mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-4xl font-bold gradient-text">Your AI Analysis</h3>
                {user && (
                  <GradientButton 
                    onClick={() => handleSaveIdea()}
                    variant="success"
                  >
                    Save Idea
                  </GradientButton>
                )}
              </div>

              {/* Rating Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <GlassmorphismCard gradient>
                  <div className="p-8">
                    <h4 className="text-2xl font-bold text-white mb-6">Idea Rating</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Progress value={analysis.rating * 10} className="h-4 mb-4" />
                        <p className="text-gray-300 text-lg">
                          {analysis.rating >= 8 ? "🚀 Excellent potential!" : 
                           analysis.rating >= 6 ? "💡 Good foundation with room for improvement" : 
                                       "🔧 Needs refinement"}
                        </p>
                      </div>
                      <div className="text-6xl font-bold gradient-text text-glow ml-8">
                        {analysis.rating}/10
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* SWOT Analysis */}
                <GlassmorphismCard>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-white mb-6">SWOT Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-green-400 font-bold mb-3">Strengths</h5>
                        <div className="space-y-2">
                          {analysis.swot.strengths.slice(0, 2).map((item: string, index: number) => (
                            <p key={index} className="text-gray-300 text-sm">{item}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-red-400 font-bold mb-3">Weaknesses</h5>
                        <div className="space-y-2">
                          {analysis.swot.weaknesses.slice(0, 2).map((item: string, index: number) => (
                            <p key={index} className="text-gray-300 text-sm">{item}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-blue-400 font-bold mb-3">Opportunities</h5>
                        <div className="space-y-2">
                          {analysis.swot.opportunities.slice(0, 2).map((item: string, index: number) => (
                            <p key={index} className="text-gray-300 text-sm">{item}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-yellow-400 font-bold mb-3">Threats</h5>
                        <div className="space-y-2">
                          {analysis.swot.threats.slice(0, 2).map((item: string, index: number) => (
                            <p key={index} className="text-gray-300 text-sm">{item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>

                {/* Monetization Strategies */}
                <GlassmorphismCard>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-white mb-6">Monetization Strategies</h4>
                    <div className="space-y-4">
                      {analysis.monetization.slice(0, 3).map((strategy: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassmorphismCard>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="text-center space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <GradientButton 
                    className="p-6 text-lg" 
                    variant="secondary"
                    onClick={() => navigate('/clarity-coach')}
                  >
                    <Brain className="w-6 h-6 mr-3" />
                    Clarity Coach Mode
                  </GradientButton>
                  <GradientButton 
                    className="p-6 text-lg" 
                    variant="primary"
                    onClick={() => navigate('/niche-validation')}
                  >
                    <Users className="w-6 h-6 mr-3" />
                    Niche Validation
                  </GradientButton>
                  <GradientButton 
                    className="p-6 text-lg" 
                    variant="success"
                    onClick={() => navigate('/business-model')}
                  >
                    <DollarSign className="w-6 h-6 mr-3" />
                    Business Model Generator
                  </GradientButton>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Saved Ideas Section */}
          <SavedIdeas />
        </div>
      </div>
    </>
  );
}

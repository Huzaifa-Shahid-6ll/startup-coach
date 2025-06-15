
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Users, DollarSign, Target, BarChart3, Rocket, Brain } from 'lucide-react';
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
  const [showSavedIdeas, setShowSavedIdeas] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const { user, loading: authLoading, signOut } = useAuth();
  const { saveIdea } = useIdeas();

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('VITE_OPENROUTER_API_KEY');
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    // Check periodically in case user sets it in another tab
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

  const renderResults = () => {
    if (!analysis) return null;

    return (
      <motion.div 
        className="max-w-6xl mx-auto"
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
            <div className="text-center">
              <h4 className="text-2xl font-bold gradient-text mb-4 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 mr-3" />
                AI Idea Rating
              </h4>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-8xl font-bold gradient-text text-glow">
                  {analysis.rating}/10
                </div>
                <div className="flex-1 max-w-md">
                  <Progress value={analysis.rating * 10} className="h-4 mb-4" />
                  <p className="text-gray-300 text-lg">
                    {analysis.rating >= 8 ? "🚀 Excellent potential!" : 
                     analysis.rating >= 6 ? "💡 Good foundation with room for improvement" : 
                                 "🔧 Needs refinement"}
                  </p>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>

        <Tabs defaultValue="swot" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-xl p-2 backdrop-blur-xl">
            <TabsTrigger value="swot" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg">
              SWOT Analysis
            </TabsTrigger>
            <TabsTrigger value="niches" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg">
              Target Niches
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg">
              Digital Products
            </TabsTrigger>
            <TabsTrigger value="monetization" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg">
              Monetization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swot">
            <div className="grid md:grid-cols-2 gap-6">
              {/* SWOT Cards */}
              <GlassmorphismCard className="border-green-500/30">
                <h4 className="text-green-400 text-xl font-bold flex items-center mb-4">
                  <Target className="w-5 h-5 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-3">
                  {analysis.swot.strengths.map((item: string, index: number) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-3 h-3 bg-green-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassmorphismCard>

              <GlassmorphismCard className="border-red-500/30">
                <h4 className="text-red-400 text-xl font-bold flex items-center mb-4">
                  <Target className="w-5 h-5 mr-2" />
                  Weaknesses
                </h4>
                <ul className="space-y-3">
                  {analysis.swot.weaknesses.map((item: string, index: number) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-3 h-3 bg-red-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassmorphismCard>

              <GlassmorphismCard className="border-blue-500/30">
                <h4 className="text-blue-400 text-xl font-bold flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Opportunities
                </h4>
                <ul className="space-y-3">
                  {analysis.swot.opportunities.map((item: string, index: number) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-3 h-3 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassmorphismCard>

              <GlassmorphismCard className="border-yellow-500/30">
                <h4 className="text-yellow-400 text-xl font-bold flex items-center mb-4">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Threats
                </h4>
                <ul className="space-y-3">
                  {analysis.swot.threats.map((item: string, index: number) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassmorphismCard>
            </div>
          </TabsContent>

          <TabsContent value="niches">
            <GlassmorphismCard gradient>
              <h4 className="gradient-text text-2xl font-bold flex items-center mb-6">
                <Users className="w-6 h-6 mr-3" />
                Target Audiences
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.niches.map((niche: string, index: number) => (
                  <motion.div 
                    key={index} 
                    className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Badge variant="secondary" className="mb-3 bg-purple-600/30 text-purple-300">
                      Niche #{index + 1}
                    </Badge>
                    <p className="text-white font-medium text-lg">{niche}</p>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </TabsContent>

          <TabsContent value="products">
            <GlassmorphismCard gradient>
              <h4 className="gradient-text text-2xl font-bold flex items-center mb-6">
                <Rocket className="w-6 h-6 mr-3" />
                Digital Product Ideas
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {analysis.products.map((product: string, index: number) => (
                  <motion.div 
                    key={index} 
                    className="p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <h5 className="text-white font-bold text-lg mb-2">{product}</h5>
                    <p className="text-gray-400">Perfect for monetizing your expertise</p>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </TabsContent>

          <TabsContent value="monetization">
            <div className="space-y-8">
              <GlassmorphismCard gradient>
                <h4 className="gradient-text text-2xl font-bold flex items-center mb-6">
                  <DollarSign className="w-6 h-6 mr-3" />
                  Monetization Strategies
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.monetization.map((strategy: string, index: number) => (
                    <motion.div 
                      key={index} 
                      className="p-6 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-xl border border-white/10 hover:border-green-400/50 transition-all duration-300"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Badge variant="outline" className="mb-3 border-green-400/50 text-green-300">
                        Strategy #{index + 1}
                      </Badge>
                      <p className="text-white font-medium text-lg">{strategy}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>

              <GlassmorphismCard className="border-orange-500/30">
                <h4 className="text-orange-400 text-2xl font-bold flex items-center mb-4">
                  <Rocket className="w-6 h-6 mr-3" />
                  MVP Recommendation
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {analysis.mvp}
                </p>
              </GlassmorphismCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div 
          className="mt-16 text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-3xl font-bold gradient-text mb-8">Ready to Take Action?</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <GradientButton className="p-8 text-lg" variant="secondary">
              <Brain className="w-6 h-6 mr-3" />
              Clarity Coach Mode
            </GradientButton>
            <GradientButton className="p-8 text-lg" variant="primary">
              <Users className="w-6 h-6 mr-3" />
              Niche Validation
            </GradientButton>
            <GradientButton className="p-8 text-lg" variant="success">
              <DollarSign className="w-6 h-6 mr-3" />
              Business Model Generator
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    );
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
              IdeaForgeAI
            </h1>
            <GradientButton onClick={() => signOut()}>
              Sign Out
            </GradientButton>
          </motion.div>

          {!hasApiKey ? (
            <ApiKeySetup onApiKeySet={() => setHasApiKey(true)} />
          ) : (
            <div className="space-y-12">
              {/* Main Analysis Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassmorphismCard className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                      Analyze Your Next Big Idea
                    </h2>
                    <p className="text-xl text-gray-300">
                      Describe your business idea and get instant AI-powered insights
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Textarea
                      placeholder="Describe your idea or skill you want to monetize... (e.g., 'I want to create online courses about digital marketing for small businesses')"
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      className="gradient-input min-h-32 text-lg"
                    />
                    
                    <GradientButton
                      onClick={handleAnalyze}
                      loading={loading}
                      disabled={!ideaText.trim() || loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? "Analyzing with AI..." : "Analyze My Idea"}
                    </GradientButton>
                  </div>
                </GlassmorphismCard>
              </motion.div>

              {/* Results Section */}
              {analysis && renderResults()}

              {/* Saved Ideas Section */}
              <SavedIdeas />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

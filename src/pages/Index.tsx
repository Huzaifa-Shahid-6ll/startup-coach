
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Lightbulb, Target, TrendingUp, DollarSign, Rocket, Brain, Users, BarChart3, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIdeas } from "@/hooks/useIdeas";
import { AuthModal } from "@/components/AuthModal";
import { SavedIdeas } from "@/components/SavedIdeas";
import { GradientBackground } from "@/components/ui/gradient-background";
import { GlassmorphismCard } from "@/components/ui/glassmorphism-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { analyzeIdea, IdeaAnalysisResponse } from "@/services/openrouter";

const Index = () => {
  const [idea, setIdea] = useState("");
  const [analysis, setAnalysis] = useState<IdeaAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showSavedIdeas, setShowSavedIdeas] = useState(false);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { saveIdea } = useIdeas();

  const analyzeIdeaWithAI = async () => {
    if (!idea.trim()) {
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
      const result = await analyzeIdea(idea);
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

    const ideaTitle = idea.slice(0, 100) + (idea.length > 100 ? "..." : "");
    
    const { error } = await saveIdea({
      title: ideaTitle,
      description: idea,
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
        <GradientBackground />
        <motion.div
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GradientBackground />

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 flex items-center justify-between p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">IdeaForgeAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <GradientButton 
                variant="secondary"
                onClick={() => setShowSavedIdeas(!showSavedIdeas)}
              >
                <User className="w-4 h-4 mr-2" />
                My Ideas
              </GradientButton>
              <GradientButton 
                variant="secondary"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </GradientButton>
            </>
          ) : (
            <GradientButton 
              variant="secondary"
              onClick={() => setAuthModalOpen(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </GradientButton>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {showSavedIdeas && user ? (
            <motion.div 
              key="saved-ideas"
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <SavedIdeas />
              <div className="mt-8 text-center">
                <GradientButton 
                  onClick={() => setShowSavedIdeas(false)}
                  variant="secondary"
                >
                  Back to Analysis
                </GradientButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                  <span className="gradient-text text-glow">Transform Ideas Into</span>
                  <br />
                  <span className="gradient-text text-glow">Digital Gold</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Get instant AI-powered analysis of your ideas with ratings, SWOT analysis, 
                  niche suggestions, and monetization strategies powered by advanced AI.
                </p>
              </motion.div>

              {/* Idea Input Section */}
              <motion.div 
                className="max-w-4xl mx-auto mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <GlassmorphismCard gradient>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold gradient-text mb-2">Describe Your Idea</h3>
                      <p className="text-gray-300 text-lg">
                        Tell us about your idea, skill, or concept you want to develop
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <Textarea
                        placeholder="I have an idea for a productivity app that helps remote workers manage their time better..."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        className="min-h-[150px] gradient-input text-lg resize-none"
                      />
                      
                      <GradientButton 
                        onClick={analyzeIdeaWithAI} 
                        loading={loading}
                        className="w-full"
                        size="lg"
                      >
                        {loading ? (
                          "Analyzing Your Idea..."
                        ) : (
                          <>
                            <Brain className="w-5 h-5 mr-2" />
                            Analyze My Idea with AI
                          </>
                        )}
                      </GradientButton>
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>

              {/* Analysis Results */}
              <AnimatePresence>
                {analysis && (
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
                          onClick={handleSaveIdea}
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
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;

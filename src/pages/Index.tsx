import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, Lightbulb, Target, TrendingUp, DollarSign, Rocket, Brain, Users, BarChart3, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIdeas } from "@/hooks/useIdeas";
import { AuthModal } from "@/components/AuthModal";
import { SavedIdeas } from "@/components/SavedIdeas";

const Index = () => {
  const [idea, setIdea] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showSavedIdeas, setShowSavedIdeas] = useState(false);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { saveIdea } = useIdeas();

  const analyzeIdea = async () => {
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
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        rating: Math.floor(Math.random() * 4) + 7, // 7-10 rating
        swot: {
          strengths: ["Unique market positioning", "Low barrier to entry", "High demand potential"],
          weaknesses: ["Limited initial resources", "Competition from established players"],
          opportunities: ["Growing market trend", "Digital transformation", "Remote work adoption"],
          threats: ["Market saturation", "Economic downturn", "Technology disruption"]
        },
        niches: ["Content creators", "Small business owners", "Online educators", "Freelancers"],
        products: ["Digital course", "Template pack", "Coaching program", "SaaS tool", "E-book"],
        monetization: ["Subscription model", "One-time purchase", "Freemium", "Affiliate marketing", "Consulting"],
        mvp: "Start with a simple landing page and pre-sell your core offering to validate demand before building the full product."
      };
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 2000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">IdeaForgeAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => setShowSavedIdeas(!showSavedIdeas)}
              >
                <User className="w-4 h-4 mr-2" />
                My Ideas
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => setAuthModalOpen(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
          {user && (
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 glow-effect">
              Get Started
            </Button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {showSavedIdeas && user ? (
          <div className="max-w-4xl mx-auto">
            <SavedIdeas />
            <div className="mt-8 text-center">
              <Button 
                onClick={() => setShowSavedIdeas(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back to Analysis
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
                Transform Ideas Into
                <span className="block">Digital Gold</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Get instant AI-powered analysis of your ideas with ratings, SWOT analysis, 
                niche suggestions, and monetization strategies.
              </p>
            </div>

            {/* Idea Input Section */}
            <div className="max-w-4xl mx-auto mb-12 animate-scale-in">
              <Card className="glass-card border-white/20 glow-effect">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">Describe Your Idea</CardTitle>
                  <CardDescription className="text-gray-300">
                    Tell us about your idea, skill, or concept you want to develop
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="I have an idea for a productivity app that helps remote workers..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 text-lg"
                  />
                  <Button 
                    onClick={analyzeIdea} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6 glow-effect"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Analyzing Your Idea...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Analyze My Idea
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold gradient-text">Your Idea Analysis</h3>
                  {user && (
                    <Button 
                      onClick={handleSaveIdea}
                      className="bg-green-600 hover:bg-green-700 glow-effect"
                    >
                      Save Idea
                    </Button>
                  )}
                </div>

                {/* Rating Card */}
                <Card className="glass-card border-white/20 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl gradient-text">
                      <TrendingUp className="w-6 h-6 mr-3" />
                      Idea Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="text-6xl font-bold gradient-text">
                        {analysis.rating}/10
                      </div>
                      <div className="flex-1">
                        <Progress value={analysis.rating * 10} className="h-3 mb-2" />
                        <p className="text-gray-300">
                          {analysis.rating >= 8 ? "Excellent potential!" : 
                           analysis.rating >= 6 ? "Good foundation with room for improvement" : 
                           "Needs refinement"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="swot" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-white/10 rounded-xl p-2">
                    <TabsTrigger value="swot" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      SWOT Analysis
                    </TabsTrigger>
                    <TabsTrigger value="niches" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Niche Ideas
                    </TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Digital Products
                    </TabsTrigger>
                    <TabsTrigger value="monetization" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      Monetization
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="swot">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="glass-card border-green-500/30">
                        <CardHeader>
                          <CardTitle className="text-green-400 flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.swot.strengths.map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-red-500/30">
                        <CardHeader>
                          <CardTitle className="text-red-400 flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Weaknesses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.swot.weaknesses.map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-blue-500/30">
                        <CardHeader>
                          <CardTitle className="text-blue-400 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Opportunities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.swot.opportunities.map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-yellow-500/30">
                        <CardHeader>
                          <CardTitle className="text-yellow-400 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Threats
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.swot.threats.map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="niches">
                    <Card className="glass-card border-white/20">
                      <CardHeader>
                        <CardTitle className="gradient-text flex items-center">
                          <Users className="w-6 h-6 mr-3" />
                          Target Niches
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Specific audiences that would benefit from your idea
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {analysis.niches.map((niche: string, index: number) => (
                            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <Badge variant="secondary" className="mb-2 bg-purple-600/20 text-purple-300">
                                Niche #{index + 1}
                              </Badge>
                              <p className="text-white font-medium">{niche}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="products">
                    <Card className="glass-card border-white/20">
                      <CardHeader>
                        <CardTitle className="gradient-text flex items-center">
                          <Rocket className="w-6 h-6 mr-3" />
                          Digital Product Ideas
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Products you can create from your idea
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          {analysis.products.map((product: string, index: number) => (
                            <div key={index} className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg border border-white/10 hover:border-purple-400/50 transition-colors">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-3">
                                <Lightbulb className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="text-white font-semibold mb-2">{product}</h4>
                              <p className="text-gray-400 text-sm">Perfect for monetizing your expertise</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="monetization">
                    <div className="space-y-6">
                      <Card className="glass-card border-white/20">
                        <CardHeader>
                          <CardTitle className="gradient-text flex items-center">
                            <DollarSign className="w-6 h-6 mr-3" />
                            Monetization Strategies
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            {analysis.monetization.map((strategy: string, index: number) => (
                              <div key={index} className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-white/10">
                                <Badge variant="outline" className="mb-2 border-green-400/50 text-green-300">
                                  Strategy #{index + 1}
                                </Badge>
                                <p className="text-white font-medium">{strategy}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-orange-500/30">
                        <CardHeader>
                          <CardTitle className="text-orange-400 flex items-center">
                            <Rocket className="w-6 h-6 mr-3" />
                            MVP Recommendation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {analysis.mvp}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="mt-12 text-center space-y-4">
                  <h4 className="text-2xl font-bold gradient-text mb-6">Ready to Take Action?</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 p-6 text-lg glow-effect">
                      <Brain className="w-5 h-5 mr-2" />
                      Clarity Coach Mode
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-6 text-lg glow-effect">
                      <Users className="w-5 h-5 mr-2" />
                      Niche Validation
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 p-6 text-lg glow-effect">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Business Model Generator
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;

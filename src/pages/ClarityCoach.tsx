
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Calendar, Lightbulb, Target } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { generateClarityPlan, ClarityPlanResponse } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function ClarityCoach() {
  const [goal, setGoal] = useState("");
  const [blocks, setBlocks] = useState("");
  const [skills, setSkills] = useState("");
  const [plan, setPlan] = useState<ClarityPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !blocks.trim() || !skills.trim()) {
      toast({
        title: "Please fill all fields",
        description: "We need your goal, blockers, and skills to create a personalized plan",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateClarityPlan(goal, blocks, skills);
      setPlan(result);
      
      toast({
        title: "Plan generated!",
        description: "Your personalized clarity plan is ready.",
      });
    } catch (error: any) {
      console.error('Plan generation error:', error);
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
                <Brain className="w-12 h-12 mr-4" />
                Clarity Coach
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
                  Get Your Weekly Action Plan
                </h2>
                <p className="text-xl text-gray-300">
                  Tell us about your goals and we'll create a personalized roadmap
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    What's your main goal or vision?
                  </label>
                  <Textarea
                    placeholder="e.g., Launch my online coaching business and make $5k/month within 6 months"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="gradient-input min-h-24 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    What's blocking you or holding you back?
                  </label>
                  <Textarea
                    placeholder="e.g., Don't know where to start, fear of failure, lack of technical skills"
                    value={blocks}
                    onChange={(e) => setBlocks(e.target.value)}
                    className="gradient-input min-h-24 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    What skills, assets, or advantages do you have?
                  </label>
                  <Textarea
                    placeholder="e.g., 10 years marketing experience, strong network, good at writing"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="gradient-input min-h-24 text-lg"
                  />
                </div>
                
                <GradientButton
                  onClick={handleGeneratePlan}
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Creating Your Plan..." : "Generate My Clarity Plan"}
                </GradientButton>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Results */}
          {plan && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Weekly Plan */}
              <GlassmorphismCard gradient>
                <h3 className="text-3xl font-bold gradient-text mb-6 flex items-center">
                  <Calendar className="w-8 h-8 mr-3" />
                  Your 7-Day Action Plan
                </h3>
                <div className="grid gap-4">
                  {plan.weeklyPlan.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-white/10"
                    >
                      <h4 className="text-xl font-bold text-white mb-3">{day.day}</h4>
                      <ul className="space-y-2">
                        {day.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-300">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphismCard>

              {/* Advice Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <GlassmorphismCard className="border-green-500/30">
                  <h4 className="text-green-400 text-xl font-bold flex items-center mb-4">
                    <Brain className="w-6 h-6 mr-2" />
                    Mindset Advice
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{plan.mindsetAdvice}</p>
                </GlassmorphismCard>

                <GlassmorphismCard className="border-blue-500/30">
                  <h4 className="text-blue-400 text-xl font-bold flex items-center mb-4">
                    <Target className="w-6 h-6 mr-2" />
                    Productivity Tip
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{plan.productivityTip}</p>
                </GlassmorphismCard>

                <GlassmorphismCard className="border-purple-500/30">
                  <h4 className="text-purple-400 text-xl font-bold flex items-center mb-4">
                    <Lightbulb className="w-6 h-6 mr-2" />
                    Motivation Boost
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{plan.pepTalk}</p>
                </GlassmorphismCard>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

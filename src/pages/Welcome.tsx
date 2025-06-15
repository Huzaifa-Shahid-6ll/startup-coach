
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3, 
  Rocket, 
  Brain, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/AuthModal';

export default function Welcome() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Lightbulb,
      title: "AI-Powered Idea Analysis",
      description: "Get instant, comprehensive analysis of your business ideas with SWOT analysis, market insights, and viability scoring.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Niche Validation",
      description: "Validate your target niche with market size analysis, competition assessment, and trend identification.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: DollarSign,
      title: "Business Model Generator",
      description: "Create detailed business models with revenue streams, cost structure, and implementation plans.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Brain,
      title: "Clarity Coach",
      description: "Get personalized guidance and actionable steps to overcome challenges and achieve your goals.",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const benefits = [
    "Turn vague ideas into actionable business plans",
    "Identify profitable niches and market opportunities",
    "Get expert-level business analysis in seconds",
    "Save weeks of research and planning time",
    "Validate ideas before investing time and money",
    "Access personalized coaching and guidance"
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Describe Your Idea",
      description: "Share your business idea, skill, or concept in your own words"
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your idea using advanced business frameworks"
    },
    {
      step: 3,
      title: "Get Insights",
      description: "Receive detailed reports with actionable recommendations"
    },
    {
      step: 4,
      title: "Take Action",
      description: "Use our specialized tools to validate and develop your concept"
    }
  ];

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-6 py-2 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Business Intelligence
              </Badge>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text mb-8 leading-tight">
              Turn Ideas Into
              <br />
              <span className="text-white">Digital Gold</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              The ultimate AI platform for entrepreneurs, creators, and innovators.
              <br />
              Analyze ideas, validate niches, and build your path to success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <GradientButton
                onClick={() => setAuthModalOpen(true)}
                size="lg"
                className="px-12 py-6 text-xl"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Your Journey
              </GradientButton>
              
              <GradientButton
                variant="secondary"
                size="lg"
                className="px-12 py-6 text-xl"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
                <ArrowRight className="w-6 h-6 ml-3" />
              </GradientButton>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Target, text: "Idea Analysis" },
                { icon: TrendingUp, text: "Market Insights" },
                { icon: Users, text: "Niche Discovery" },
                { icon: DollarSign, text: "Monetization" },
                { icon: BarChart3, text: "Validation" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="bg-white/5 text-white border-white/20 px-4 py-2">
                    <feature.icon className="w-4 h-4 mr-2" />
                    {feature.text}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                Powerful AI Tools
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to turn your ideas into profitable businesses
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassmorphismCard className="p-8 h-full hover:scale-105 transition-transform duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </GlassmorphismCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From idea to execution in four simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-8">
                  Why Choose IdeaForgeAI?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Skip the guesswork and get professional-grade business analysis powered by cutting-edge AI technology.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassmorphismCard gradient className="p-12">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-2xl text-white mb-6 italic">
                      "IdeaForgeAI helped me validate my business idea and create a solid plan in just minutes. It's like having a business consultant in your pocket!"
                    </blockquote>
                    <p className="text-gray-300">— Sarah Chen, Entrepreneur</p>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-8">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Join thousands of entrepreneurs who are using AI to build successful businesses.
              </p>
              <GradientButton
                onClick={() => setAuthModalOpen(true)}
                size="lg"
                className="px-16 py-8 text-2xl"
              >
                <Sparkles className="w-8 h-8 mr-4" />
                Get Started Now
              </GradientButton>
            </motion.div>
          </div>
        </section>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

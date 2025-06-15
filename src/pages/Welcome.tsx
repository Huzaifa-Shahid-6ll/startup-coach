
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
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Users,
      title: "Niche Validation",
      description: "Validate your target niche with market size analysis, competition assessment, and trend identification.",
      color: "from-purple-400 to-blue-500"
    },
    {
      icon: DollarSign,
      title: "Business Model Generator",
      description: "Create detailed business models with revenue streams, cost structure, and implementation plans.",
      color: "from-pink-400 to-purple-500"
    },
    {
      icon: Target,
      title: "Startup Coaching",
      description: "Get personalized guidance and actionable steps to overcome challenges and achieve your entrepreneurial goals.",
      color: "from-cyan-400 to-blue-500"
    }
  ];

  const benefits = [
    "Turn vague ideas into actionable startup plans",
    "Identify profitable niches and market opportunities",
    "Get expert-level business analysis in seconds",
    "Save weeks of research and planning time",
    "Validate ideas before investing time and money",
    "Access personalized startup coaching and guidance"
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Describe Your Idea",
      description: "Share your startup idea, skill, or concept in your own words"
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
      title: "Launch & Scale",
      description: "Use our specialized tools to validate and develop your startup"
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex justify-center mb-8">
                <img 
                  src="/lovable-uploads/2fb9b1e4-a980-4f8d-be2f-86ae15a57f5f.png" 
                  alt="Startup Coach"
                  className="w-80 h-auto rocket-float glow-effect"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="startup-flow-gradient text-white border-white/20 px-6 py-2 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Startup Intelligence
              </Badge>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold startup-gradient-text mb-8 leading-tight text-glow">
              Transform Ideas Into
              <br />
              <span className="text-white">Successful Startups</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              The ultimate AI platform for entrepreneurs, innovators, and startup founders.
              <br />
              Analyze ideas, validate markets, and build your path to startup success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <GradientButton
                onClick={() => setAuthModalOpen(true)}
                size="lg"
                className="px-12 py-6 text-xl startup-flow"
              >
                <div className="w-6 h-6 mr-3">🚀</div>
                Launch Your Startup Journey
              </GradientButton>
              
              <GradientButton
                variant="secondary"
                size="lg"
                className="px-12 py-6 text-xl"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
                <ArrowRight className="w-6 h-6 ml-3" />
              </GradientButton>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Target, text: "Idea Validation" },
                { icon: TrendingUp, text: "Market Analysis" },
                { icon: Users, text: "Niche Discovery" },
                { icon: DollarSign, text: "Revenue Models" },
                { icon: BarChart3, text: "Growth Strategy" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="startup-card text-white border-white/20 px-4 py-2">
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
              <h2 className="text-4xl md:text-6xl font-bold startup-gradient-text mb-6">
                Powerful Startup Tools
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to turn your ideas into thriving startups
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
                  <div className="startup-card p-8 h-full hover:scale-105 transition-transform duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
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
              <h2 className="text-4xl md:text-6xl font-bold startup-gradient-text mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From idea to successful startup in four simple steps
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
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
                <h2 className="text-4xl md:text-6xl font-bold startup-gradient-text mb-8">
                  Why Choose Startup Coach?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Skip the guesswork and get professional-grade startup analysis powered by cutting-edge AI technology.
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
                      <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
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
                <div className="startup-card p-12">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-2xl text-white mb-6 italic">
                      "Startup Coach helped me validate my business idea and create a solid plan in just minutes. It's like having a startup mentor in your pocket!"
                    </blockquote>
                    <p className="text-gray-300">— Sarah Chen, Tech Entrepreneur</p>
                  </div>
                </div>
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
              <h2 className="text-4xl md:text-6xl font-bold startup-gradient-text mb-8">
                Ready to Build Your Startup?
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Join thousands of entrepreneurs who are using AI to build successful startups.
              </p>
              <GradientButton
                onClick={() => setAuthModalOpen(true)}
                size="lg"
                className="px-16 py-8 text-2xl startup-flow"
              >
                <Sparkles className="w-8 h-8 mr-4" />
                Start Building Now
              </GradientButton>
            </motion.div>
          </div>
        </section>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

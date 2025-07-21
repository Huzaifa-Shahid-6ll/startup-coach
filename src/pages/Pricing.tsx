
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Navigation } from '@/components/Navigation';
import { getUserTier, setUserTier, type SubscriptionTier } from '@/utils/apiKeyManager';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const currentTier = getUserTier();

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      navigate('/dashboard');
    } else {
      // In a real app, this would integrate with a payment processor
      setUserTier(tier);
      toast({
        title: `Upgraded to ${tier.toUpperCase()} Tier! 🚀`,
        description: `You now have access to ${tier === 'pro' ? 'OpenAI o3-mini' : 'GPT-4o Extended'} with enhanced capabilities.`,
      });
      navigate('/dashboard');
    }
  };

  const plans = [
    {
      tier: 'free' as SubscriptionTier,
      name: 'Free Tier',
      subtitle: 'Basic',
      model: 'tngtech/deepseek-r1t2-chimera:free',
      price: 'Free',
      tokens: '5,000',
      icon: Star,
      color: 'green',
      features: [
        'Access to the basic monetization plan',
        'Limited token usage',
        'Ideal for beginners and those just starting out',
        'Basic AI analysis'
      ],
      cta: 'Get Started for Free',
      popular: false
    },
    {
      tier: 'pro' as SubscriptionTier,
      name: 'PRO Tier',
      subtitle: 'Premium',
      model: 'OpenAI o3-mini',
      price: '$25',
      tokens: '20,000',
      icon: Zap,
      color: 'blue',
      features: [
        'Advanced monetization strategies',
        'Increased token usage',
        'Perfect for growing businesses',
        '24/7 customer support',
        'Advanced AI reasoning'
      ],
      cta: 'Upgrade to PRO',
      popular: true
    },
    {
      tier: 'ultra' as SubscriptionTier,
      name: 'ULTRA Tier',
      subtitle: 'Advanced',
      model: 'openai/gpt-4o:extended',
      price: '$125',
      tokens: '50,000',
      icon: Crown,
      color: 'purple',
      features: [
        'Premium access to the most advanced monetization plan',
        'Highest token limit',
        'Ideal for established businesses looking to scale',
        '24/7 priority customer support',
        'Premium AI capabilities'
      ],
      cta: 'Upgrade to ULTRA',
      popular: false
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          border: 'border-green-500/20',
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          icon: 'text-green-400',
          button: 'from-green-600 to-green-500'
        };
      case 'blue':
        return {
          border: 'border-blue-500/20',
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          icon: 'text-blue-400',
          button: 'from-blue-600 to-blue-500'
        };
      case 'purple':
        return {
          border: 'border-purple-500/20',
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          icon: 'text-purple-400',
          button: 'from-purple-600 to-purple-500'
        };
      default:
        return {
          border: 'border-white/20',
          bg: 'bg-white/10',
          text: 'text-white',
          icon: 'text-white',
          button: 'from-blue-600 to-purple-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
      <Navigation title="Pricing Plans" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs and start turning your business ideas into reality with our Three-Week Monetization Plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color);
            const isCurrentTier = currentTier === plan.tier;
            
            return (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <GlassmorphismCard 
                  className={`h-full p-8 relative ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                      <plan.icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className={`text-sm ${colors.text} mb-4`}>{plan.subtitle}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.price !== 'Free' && <span className="text-gray-400 ml-1">/month</span>}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.tokens} tokens per month</p>
                    <p className="text-gray-500 text-xs mt-1">{plan.model}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${colors.icon} mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <GradientButton
                      onClick={() => handleUpgrade(plan.tier)}
                      className={`w-full ${isCurrentTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isCurrentTier}
                    >
                      {isCurrentTier ? 'Current Plan' : plan.cta}
                    </GradientButton>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">24/7 Customer Support</h3>
            <p className="text-gray-300">
              PRO and ULTRA tier subscribers get access to our dedicated customer support team, 
              available 24/7 to help you maximize your business potential.
            </p>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Custom Plans Available</h3>
            <p className="text-gray-300 mb-4">
              Need something specific for your business? We offer custom plans tailored to your 
              unique requirements and scale.
            </p>
            <GradientButton variant="secondary">
              Contact Us
            </GradientButton>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;

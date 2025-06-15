
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft, Send, User, Bot, Lightbulb } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Input } from '@/components/ui/input';
import { generateClarityPlan } from '@/services/openrouter';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserData {
  goal?: string;
  blocks?: string;
  skills?: string;
}

export default function ClarityCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Clarity Coach. I'm here to help you create a personalized action plan to achieve your goals. Let's start - what's your main goal or vision you'd like to work towards?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getNextQuestion = (step: number): string => {
    switch (step) {
      case 2:
        return "Great! Now, what's currently blocking you or holding you back from achieving this goal?";
      case 3:
        return "I understand. Now tell me about your strengths - what skills, assets, or advantages do you have that can help you succeed?";
      case 4:
        return "Perfect! Let me create your personalized clarity plan based on everything you've shared. This will include a 7-day action plan, mindset advice, and productivity tips.";
      default:
        return "";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue("");
    setLoading(true);

    try {
      // Store user data based on current step
      const newUserData = { ...userData };
      if (currentStep === 1) newUserData.goal = userMessage;
      else if (currentStep === 2) newUserData.blocks = userMessage;
      else if (currentStep === 3) newUserData.skills = userMessage;
      
      setUserData(newUserData);

      if (currentStep < 3) {
        // Ask next question
        setTimeout(() => {
          const nextQuestion = getNextQuestion(currentStep + 1);
          addMessage(nextQuestion, 'assistant');
          setCurrentStep(prev => prev + 1);
          setLoading(false);
        }, 1000);
      } else {
        // Generate plan
        if (newUserData.goal && newUserData.blocks && newUserData.skills) {
          const plan = await generateClarityPlan(
            newUserData.goal,
            newUserData.blocks,
            newUserData.skills
          );

          // Format the plan as a conversational response
          let planMessage = "Here's your personalized 7-day clarity plan:\n\n";
          
          plan.weeklyPlan.forEach((day, index) => {
            planMessage += `**${day.day}:**\n`;
            day.tasks.forEach(task => {
              planMessage += `• ${task}\n`;
            });
            planMessage += "\n";
          });

          planMessage += `**💡 Mindset Advice:** ${plan.mindsetAdvice}\n\n`;
          planMessage += `**⚡ Productivity Tip:** ${plan.productivityTip}\n\n`;
          planMessage += `**🚀 Motivation Boost:** ${plan.pepTalk}`;

          addMessage(planMessage, 'assistant');
          
          setTimeout(() => {
            addMessage("Your plan is ready! You can always come back and chat with me again if you need adjustments or have questions about implementing these actions.", 'assistant');
          }, 2000);

          toast({
            title: "Plan generated!",
            description: "Your personalized clarity plan is ready.",
          });
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      addMessage("I apologize, but I'm having trouble generating your plan right now. Please make sure your API key is configured and try again.", 'assistant');
      toast({
        title: "Generation failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
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
              <h1 className="text-3xl md:text-5xl font-bold gradient-text flex items-center">
                <Brain className="w-10 h-10 mr-3" />
                Clarity Coach Chat
              </h1>
            </div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassmorphismCard className="h-[600px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-green-500 to-teal-500'
                        }`}>
                          {message.type === 'user' ? 
                            <User className="w-4 h-4 text-white" /> : 
                            <Bot className="w-4 h-4 text-white" />
                          }
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white/10 border border-white/20 text-gray-100'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/10">
                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    disabled={loading}
                  />
                  <GradientButton
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || loading}
                    className="px-4"
                  >
                    <Send className="w-4 h-4" />
                  </GradientButton>
                </div>
                
                {/* Progress indicator */}
                <div className="mt-4 flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step <= currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Step {currentStep} of 4
                </p>
              </div>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}

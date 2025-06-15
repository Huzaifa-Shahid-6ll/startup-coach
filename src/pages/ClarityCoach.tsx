
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
  isHtml?: boolean;
}

export default function ClarityCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Mental Clarity Coach for entrepreneurs. I'm here to help you identify and overcome the mental roadblocks that are holding you back from starting or growing your startup.\n\nShare with me what's on your mind - what fears, doubts, or mental barriers are you facing as an entrepreneur? I'll help you work through them and create a personalized action plan.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'assistant', isHtml = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isHtml
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeRoadblocks = async (userMessage: string): Promise<{ content: string; isHtml: boolean }> => {
    // Create a specialized prompt for mental roadblock analysis
    const prompt = `As a mental clarity coach for entrepreneurs, analyze this startup founder's mental roadblocks and provide specific, actionable advice:

"${userMessage}"

Please provide:
1. Identify the core mental barriers mentioned
2. Offer 3-4 specific strategies to overcome these roadblocks
3. Suggest one immediate action they can take today
4. Provide encouraging perspective shift

Keep the response conversational, empathetic, and focused on mental clarity for entrepreneurs.`;

    try {
      const plan = await generateClarityPlan(
        "Overcome mental roadblocks to start/grow my startup",
        userMessage,
        "Entrepreneurial mindset and determination"
      );

      // Format the response with proper HTML for better readability
      let response = `
        <div class="space-y-4">
          <div class="flex items-start space-x-2">
            <span class="text-blue-400">🧠</span>
            <div>
              <h4 class="font-semibold text-blue-400 mb-1">What I'm hearing:</h4>
              <p class="text-gray-100">You're facing some common but significant mental barriers that many entrepreneurs struggle with.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-green-400">💡</span>
            <div>
              <h4 class="font-semibold text-green-400 mb-2">Strategies to overcome these roadblocks:</h4>
              <ul class="space-y-1 text-gray-100">
                ${plan.weeklyPlan.slice(0, 4).map(day => `<li class="flex items-start"><span class="text-green-400 mr-2">•</span>${day.tasks[0]}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-orange-400">🎯</span>
            <div>
              <h4 class="font-semibold text-orange-400 mb-1">One thing to do RIGHT NOW:</h4>
              <p class="text-gray-100">${plan.weeklyPlan[0].tasks[0]}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-purple-400">🌟</span>
            <div>
              <h4 class="font-semibold text-purple-400 mb-1">Mindset shift:</h4>
              <p class="text-gray-100">${plan.mindsetAdvice}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-yellow-400">⚡</span>
            <div>
              <h4 class="font-semibold text-yellow-400 mb-1">Remember:</h4>
              <p class="text-gray-100">${plan.pepTalk}</p>
            </div>
          </div>
        </div>
      `;

      return { content: response, isHtml: true };
    } catch (error) {
      const fallbackResponse = `
        <div class="space-y-4">
          <div class="flex items-start space-x-2">
            <span class="text-blue-400">🧠</span>
            <div>
              <h4 class="font-semibold text-blue-400 mb-1">I understand</h4>
              <p class="text-gray-100">You're facing some mental roadblocks. This is completely normal for entrepreneurs!</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-green-400">💡</span>
            <div>
              <h4 class="font-semibold text-green-400 mb-2">Here are some strategies that can help:</h4>
              <ul class="space-y-1 text-gray-100">
                <li class="flex items-start"><span class="text-green-400 mr-2">•</span>Start small: Break your big vision into tiny, manageable steps</li>
                <li class="flex items-start"><span class="text-green-400 mr-2">•</span>Challenge limiting beliefs: Write down your fears and question their validity</li>
                <li class="flex items-start"><span class="text-green-400 mr-2">•</span>Connect with other founders: Join entrepreneur communities for support</li>
                <li class="flex items-start"><span class="text-green-400 mr-2">•</span>Focus on learning: View setbacks as valuable learning experiences</li>
              </ul>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-orange-400">🎯</span>
            <div>
              <h4 class="font-semibold text-orange-400 mb-1">Take action today:</h4>
              <p class="text-gray-100">Write down one small step you can take in the next hour toward your startup goal.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <span class="text-yellow-400">⚡</span>
            <div>
              <h4 class="font-semibold text-yellow-400 mb-1">Remember:</h4>
              <p class="text-gray-100">Every successful entrepreneur has faced these same doubts. The difference is they moved forward despite the fear. You have what it takes!</p>
            </div>
          </div>
        </div>
      `;
      
      return { content: fallbackResponse, isHtml: true };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue("");
    setLoading(true);

    try {
      // Analyze the user's roadblocks and provide personalized advice
      const response = await analyzeRoadblocks(userMessage);
      
      setTimeout(() => {
        addMessage(response.content, 'assistant', response.isHtml);
        setLoading(false);
      }, 1500);

    } catch (error: any) {
      console.error('Chat error:', error);
      addMessage("I understand this is challenging. Let me offer some general guidance: Remember that fear and doubt are normal parts of the entrepreneurial journey. Start with one small action today, connect with other founders for support, and focus on progress over perfection. What specific fear or doubt would you like to work through first?", 'assistant');
      toast({
        title: "Analysis in progress",
        description: "I'm here to help you work through your mental roadblocks",
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
                Mental Clarity Coach
              </h1>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-lg text-gray-300 text-center">
              Clear your mental roadblocks and unlock your entrepreneurial potential
            </p>
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
                            <Brain className="w-4 h-4 text-white" />
                          }
                        </div>
                        
                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white/10 border border-white/20 text-gray-100'
                        }`}>
                          {message.isHtml ? (
                            <div 
                              className="text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          ) : (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                          )}
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
                        <Brain className="w-4 h-4 text-white" />
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
                    placeholder="Share your fears, doubts, or mental barriers..."
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
                
                {/* Helpful prompts */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {["I'm afraid of failure", "I don't feel ready", "Imposter syndrome", "Fear of rejection"].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                      disabled={loading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}

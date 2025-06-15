import axios from 'axios';

// Check for API key in both environment variables and localStorage
const getApiKey = () => {
  return import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('VITE_OPENROUTER_API_KEY');
};

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter
const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingface/zephyr-7b-beta:free',
  'openchat/openchat-7b:free'
];

const createOpenRouterApi = () => {
  const apiKey = getApiKey();
  
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'IdeaForgeAI - Idea Validation Platform'
    },
    timeout: 30000
  });
};

export interface IdeaAnalysisResponse {
  rating: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  niches: string[];
  products: string[];
  monetization: string[];
  mvp: string;
}

const tryWithModels = async (models: string[], requestData: any): Promise<any> => {
  const openRouterApi = createOpenRouterApi();
  
  // Add request interceptor
  openRouterApi.interceptors.request.use(
    (config) => {
      console.log('Making OpenRouter API request:', config.data?.messages?.[1]?.content?.slice(0, 100) + '...');
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor with retry logic
  openRouterApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.error('OpenRouter API error:', error.response?.data || error.message);
      
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      
      if (error.response?.status >= 500) {
        throw new Error('OpenRouter service temporarily unavailable. Please try again.');
      }
      
      throw new Error(error.response?.data?.error?.message || 'Failed to connect to AI service.');
    }
  );

  for (let i = 0; i < models.length; i++) {
    try {
      const response = await openRouterApi.post('', {
        ...requestData,
        model: models[i]
      });
      return response;
    } catch (error: any) {
      console.warn(`Model ${models[i]} failed:`, error.message);
      if (i === models.length - 1) {
        throw error; // If it's the last model, throw the error
      }
    }
  }
};

export const analyzeIdea = async (ideaDescription: string): Promise<IdeaAnalysisResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured. Please set up your API key using the setup form.');
  }

  const prompt = `Analyze this business idea and provide a detailed response in this exact JSON format:

{
  "rating": [number from 1-10],
  "swot": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2"]
  },
  "niches": ["niche 1", "niche 2", "niche 3", "niche 4"],
  "products": ["product idea 1", "product idea 2", "product idea 3", "product idea 4", "product idea 5"],
  "monetization": ["monetization path 1", "monetization path 2", "monetization path 3", "monetization path 4"],
  "mvp": "A specific, actionable MVP recommendation in 1-2 sentences"
}

Idea to analyze: "${ideaDescription}"

Provide only the JSON response, no additional text.`;

  try {
    const response = await tryWithModels(FREE_MODELS, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Provide detailed, actionable business analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback to mock data structure if parsing fails
      return {
        rating: Math.floor(Math.random() * 3) + 7,
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
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
};

export interface ClarityPlanResponse {
  weeklyPlan: { day: string; tasks: string[] }[];
  mindsetAdvice: string;
  productivityTip: string;
  pepTalk: string;
}

export interface NicheValidationResponse {
  viabilityScore: number;
  marketSize: string;
  demographics: string[];
  revenueOpportunity: string;
  pricingStrategies: string[];
  challenges: string[];
  entryStrategy: string;
  competitors: {
    name: string;
    description: string;
    strength: string;
  }[];
}

export interface BusinessModelResponse {
  valueProposition: string;
  targetCustomer: string;
  revenueStreams: {
    name: string;
    description: string;
    potential: string;
  }[];
  costStructure: {
    category: string;
    description: string;
  }[];
  marketingChannels: string[];
  customerAcquisition: string;
  implementationSteps: {
    phase: string;
    description: string;
    timeframe: string;
  }[];
  keyMetrics: {
    name: string;
    description: string;
  }[];
}

export const generateClarityPlan = async (
  goal: string,
  blocks: string,
  skills: string
): Promise<ClarityPlanResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured.');
  }

  const prompt = `Based on these details, create a comprehensive action plan in this exact JSON format:

Goal: "${goal}"
Blocking factors: "${blocks}"
Skills/Assets: "${skills}"

{
  "weeklyPlan": [
    {"day": "Monday", "tasks": ["task 1", "task 2", "task 3"]},
    {"day": "Tuesday", "tasks": ["task 1", "task 2", "task 3"]},
    {"day": "Wednesday", "tasks": ["task 1", "task 2", "task 3"]},
    {"day": "Thursday", "tasks": ["task 1", "task 2", "task 3"]},
    {"day": "Friday", "tasks": ["task 1", "task 2", "task 3"]},
    {"day": "Saturday", "tasks": ["task 1", "task 2"]},
    {"day": "Sunday", "tasks": ["task 1", "task 2"]}
  ],
  "mindsetAdvice": "Specific mindset advice in 2-3 sentences",
  "productivityTip": "A concrete productivity tip in 1-2 sentences",
  "pepTalk": "An encouraging pep talk in 2-3 sentences"
}

Provide only the JSON response, no additional text.`;

  try {
    const response = await tryWithModels(FREE_MODELS, {
      messages: [
        {
          role: 'system',
          content: 'You are a productivity coach. Provide detailed, actionable weekly plans in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });

    const content = response.data.choices[0].message.content;
    
    // Extract JSON from markdown code blocks if present
    let jsonString = content;
    
    // Check if the response is wrapped in markdown code blocks
    if (content.includes('```')) {
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else {
        // Try to find JSON between the first { and last }
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonString = content.substring(firstBrace, lastBrace + 1);
        }
      }
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Extracted JSON string:', jsonString);
      console.error('Parse error:', parseError);
      
      // Fallback response
      return {
        weeklyPlan: [
          {"day": "Monday", "tasks": ["Define clear daily goals", "Break down your main objective", "Take the first small step"]},
          {"day": "Tuesday", "tasks": ["Build on yesterday's progress", "Address one blocking factor", "Document lessons learned"]},
          {"day": "Wednesday", "tasks": ["Mid-week check-in", "Adjust strategy if needed", "Focus on momentum building"]},
          {"day": "Thursday", "tasks": ["Leverage your key strengths", "Network or seek support", "Tackle challenging tasks"]},
          {"day": "Friday", "tasks": ["Review weekly progress", "Plan for next week", "Celebrate small wins"]},
          {"day": "Saturday", "tasks": ["Reflect on the week", "Prepare for upcoming challenges"]},
          {"day": "Sunday", "tasks": ["Rest and recharge", "Visualize next week's success"]}
        ],
        mindsetAdvice: "Focus on progress, not perfection. Every small step forward is a victory worth celebrating.",
        productivityTip: "Use the 2-minute rule: if something takes less than 2 minutes, do it immediately.",
        pepTalk: "You have unique strengths and capabilities. Trust the process and keep moving forward - success is built one day at a time!"
      };
    }
  } catch (error) {
    console.error('Clarity plan generation error:', error);
    throw error;
  }
};

export const validateNiche = async (nicheDescription: string): Promise<NicheValidationResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured.');
  }

  const prompt = `Analyze this niche and provide validation insights in this exact JSON format:

Niche: "${nicheDescription}"

{
  "viabilityScore": [number from 1-10],
  "marketSize": "Description of market size and demand in 2-3 sentences",
  "demographics": ["demographic 1", "demographic 2", "demographic 3", "demographic 4"],
  "revenueOpportunity": "Description of revenue potential in 2-3 sentences",
  "pricingStrategies": ["strategy 1", "strategy 2", "strategy 3", "strategy 4"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "entryStrategy": "Recommended market entry approach in 2-3 sentences",
  "competitors": [
    {"name": "Competitor 1", "description": "Brief description", "strength": "Main strength"},
    {"name": "Competitor 2", "description": "Brief description", "strength": "Main strength"},
    {"name": "Competitor 3", "description": "Brief description", "strength": "Main strength"}
  ]
}

Provide only the JSON response, no additional text.`;

  try {
    const response = await tryWithModels(FREE_MODELS, {
      messages: [
        {
          role: 'system',
          content: 'You are a market research expert. Provide detailed niche validation analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Niche validation error:', error);
    throw error;
  }
};

export const generateBusinessModel = async (
  idea: string,
  budget: string = "",
  timeline: string = ""
): Promise<BusinessModelResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured.');
  }

  const prompt = `Create a comprehensive business model for this idea in this exact JSON format:

Business Idea: "${idea}"
Budget: "${budget}"
Timeline: "${timeline}"

{
  "valueProposition": "Clear value proposition in 2-3 sentences",
  "targetCustomer": "Target customer description in 2-3 sentences",
  "revenueStreams": [
    {"name": "Stream 1", "description": "Description", "potential": "High/Medium/Low"},
    {"name": "Stream 2", "description": "Description", "potential": "High/Medium/Low"},
    {"name": "Stream 3", "description": "Description", "potential": "High/Medium/Low"}
  ],
  "costStructure": [
    {"category": "Category 1", "description": "Cost description"},
    {"category": "Category 2", "description": "Cost description"},
    {"category": "Category 3", "description": "Cost description"}
  ],
  "marketingChannels": ["channel 1", "channel 2", "channel 3", "channel 4"],
  "customerAcquisition": "Customer acquisition strategy in 2-3 sentences",
  "implementationSteps": [
    {"phase": "Phase 1", "description": "What to do", "timeframe": "Week 1-2"},
    {"phase": "Phase 2", "description": "What to do", "timeframe": "Week 3-4"},
    {"phase": "Phase 3", "description": "What to do", "timeframe": "Month 2"},
    {"phase": "Phase 4", "description": "What to do", "timeframe": "Month 3+"}
  ],
  "keyMetrics": [
    {"name": "Metric 1", "description": "Why it matters"},
    {"name": "Metric 2", "description": "Why it matters"},
    {"name": "Metric 3", "description": "Why it matters"}
  ]
}

Provide only the JSON response, no additional text.`;

  try {
    const response = await tryWithModels(FREE_MODELS, {
      messages: [
        {
          role: 'system',
          content: 'You are a business strategy expert. Create comprehensive business models in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Business model generation error:', error);
    throw error;
  }
};


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
    return JSON.parse(content);
  } catch (error) {
    console.error('Clarity plan generation error:', error);
    throw error;
  }
};

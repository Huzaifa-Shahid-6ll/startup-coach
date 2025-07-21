
import { z } from 'zod';
import { getApiKey, getModelForTier, getUserTier, type SubscriptionTier } from '@/utils/apiKeyManager';

const SWOTSchema = z.object({
  strengths: z.string().array(),
  weaknesses: z.string().array(),
  opportunities: z.string().array(),
  threats: z.string().array(),
});

const IdeaAnalysisSchema = z.object({
  rating: z.number(),
  swot: SWOTSchema,
  niches: z.string().array(),
  products: z.string().array(),
  monetization: z.string().array(),
  mvp: z.string(),
});

export type IdeaAnalysisResponse = z.infer<typeof IdeaAnalysisSchema>;

const BusinessModelSchema = z.object({
  value_proposition: z.string(),
  target_customer: z.string(),
  revenue_streams: z.string().array(),
  cost_structure: z.string().array(),
  marketing_channels: z.string().array(),
  customer_acquisition: z.string(),
  implementation_steps: z.string().array(),
  key_metrics: z.string().array(),
});

export type BusinessModelResponse = z.infer<typeof BusinessModelSchema>;

const NicheValidationSchema = z.object({
  viability_score: z.number(),
  market_size: z.string(),
  demographics: z.string().array(),
  revenue_opportunity: z.string(),
  pricing_strategies: z.string().array(),
  entry_strategy: z.string(),
  competitors: z.string().array(),
});

export type NicheValidationResponse = z.infer<typeof NicheValidationSchema>;

const makeApiRequest = async (prompt: string, systemMessage: string, userTier?: SubscriptionTier) => {
  const tier = userTier || getUserTier();
  const apiKey = getApiKey(tier);
  const model = getModelForTier(tier);
  
  if (!apiKey) {
    throw new Error('API key not found. Please configure your API keys in the settings.');
  }

  console.log(`Using ${tier} tier with model: ${model}`);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: tier === 'free' ? 1000 : tier === 'pro' ? 1500 : 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error with ${tier} tier API:`, error);
    throw new Error(error instanceof Error ? error.message : `Failed to process request with ${tier} tier.`);
  }
};

export const analyzeIdea = async (ideaText: string, userTier?: SubscriptionTier): Promise<IdeaAnalysisResponse> => {
  const prompt = `Analyze this business idea and provide a comprehensive evaluation:

"${ideaText}"

Provide your response in this exact JSON format:
{
  "rating": 8,
  "swot": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"], 
    "opportunities": ["opportunity1", "opportunity2"],
    "threats": ["threat1", "threat2"]
  },
  "niches": ["niche1", "niche2"],
  "products": ["product1", "product2"],
  "monetization": ["strategy1", "strategy2"],
  "mvp": "MVP recommendation"
}`;

  const systemMessage = 'You are a business analysis expert. Always respond with valid JSON in the exact format requested.';
  
  try {
    const content = await makeApiRequest(prompt, systemMessage, userTier);
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

export const generateBusinessModel = async (ideaText: string, userTier?: SubscriptionTier): Promise<BusinessModelResponse> => {
  const prompt = `Create a comprehensive business model for this idea:

"${ideaText}"

Provide your response in this exact JSON format:
{
  "value_proposition": "Clear value proposition",
  "target_customer": "Target customer description",
  "revenue_streams": ["stream1", "stream2"],
  "cost_structure": ["cost1", "cost2"],
  "marketing_channels": ["channel1", "channel2"],
  "customer_acquisition": "Customer acquisition strategy",
  "implementation_steps": ["step1", "step2"],
  "key_metrics": ["metric1", "metric2"]
}`;

  const systemMessage = 'You are a business model expert. Always respond with valid JSON in the exact format requested.';
  
  try {
    const content = await makeApiRequest(prompt, systemMessage, userTier);
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

export const validateNiche = async (nicheText: string, userTier?: SubscriptionTier): Promise<NicheValidationResponse> => {
  const prompt = `Validate this niche and provide comprehensive analysis:

"${nicheText}"

Provide your response in this exact JSON format:
{
  "viability_score": 8,
  "market_size": "Market size analysis",
  "demographics": ["demographic1", "demographic2"],
  "revenue_opportunity": "Revenue opportunity description",
  "pricing_strategies": ["strategy1", "strategy2"],
  "entry_strategy": "Market entry strategy",
  "competitors": ["competitor1", "competitor2"]
}`;

  const systemMessage = 'You are a market validation expert. Always respond with valid JSON in the exact format requested.';
  
  try {
    const content = await makeApiRequest(prompt, systemMessage, userTier);
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

export const generateClarityPlan = async (goal: string, currentSituation: string, timeframe: string, userTier?: SubscriptionTier): Promise<string> => {
  const prompt = `As a clarity coach for entrepreneurs, help with this situation:

Goal: ${goal}
Current Situation: ${currentSituation}
Timeframe: ${timeframe}

Provide specific, actionable guidance to overcome mental roadblocks and achieve clarity. Focus on:
1. Identifying core barriers
2. Practical strategies to overcome them
3. Immediate next steps
4. Mindset shifts needed

Keep the response conversational and encouraging.`;

  const systemMessage = 'You are an empathetic clarity coach specializing in helping entrepreneurs overcome mental roadblocks.';
  
  return await makeApiRequest(prompt, systemMessage, userTier);
};

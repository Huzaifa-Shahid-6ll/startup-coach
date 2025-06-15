import axios from 'axios';

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface IdeaAnalysisResponse {
  rating: number;
  swot: SWOT;
  niches: string[];
  products: string[];
  monetization: string[];
  mvp: string;
}

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('VITE_OPENROUTER_API_KEY');

const prompt = `
You are an expert business analyst. Analyze the given idea and provide a detailed response in the exact JSON format requested. Do not include any markdown formatting or code blocks - return only valid JSON.

{
  "rating": [number from 1-10],
  "swot": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
    "threats": ["threat1", "threat2"]
  },
  "niches": ["niche1", "niche2", "niche3"],
  "products": ["product1", "product2", "product3"],
  "monetization": ["strategy1", "strategy2", "strategy3"],
  "mvp": "detailed MVP recommendation"
}
`;

export const analyzeIdea = async (idea: string): Promise<IdeaAnalysisResponse> => {
  try {
    console.log('Making OpenRouter API request:', prompt);
    
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Analyze the given idea and provide a detailed response in the exact JSON format requested. Do not include any markdown formatting or code blocks - return only valid JSON.'
        },
        {
          role: 'user',
          content: `Analyze this business idea and provide a detailed response in this exact JSON format:

{
  "rating": [number from 1-10],
  "swot": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
    "threats": ["threat1", "threat2"]
  },
  "niches": ["niche1", "niche2", "niche3"],
  "products": ["product1", "product2", "product3"],
  "monetization": ["strategy1", "strategy2", "strategy3"],
  "mvp": "detailed MVP recommendation"
}

Idea: ${idea}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
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
      
      // Instead of placeholder data, throw an error
      throw new Error('Failed to analyze idea. Please try again with a more detailed description.');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    if (error.message && error.message.includes('Failed to analyze idea')) {
      throw error;
    }
    throw new Error('Unable to analyze idea. Please check your connection and try again.');
  }
};

export const validateNiche = async (niche: string): Promise<string> => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Analyze the given niche and provide a detailed response.'
        },
        {
          role: 'user',
          content: `Analyze this niche and provide a detailed response: ${niche}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Niche validation error:', error);
    throw new Error('Unable to validate niche. Please check your connection and try again.');
  }
};

export const generateBusinessModel = async (idea: string): Promise<string> => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Generate a business model for the given idea and provide a detailed response.'
        },
        {
          role: 'user',
          content: `Generate a business model for this idea and provide a detailed response: ${idea}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Business model generation error:', error);
    throw new Error('Unable to generate business model. Please check your connection and try again.');
  }
};


// API Key and Model management for different subscription tiers
export type SubscriptionTier = 'free' | 'pro' | 'ultra';

export interface TierConfig {
  apiKey: string;
  model: string;
  tokenLimit: number;
  price: number;
  name: string;
}

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: {
    apiKey: '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',
    model: 'tngtech/deepseek-r1t2-chimera:free',
    tokenLimit: 5000,
    price: 0,
    name: 'Free Tier'
  },
  pro: {
    apiKey: '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',
    model: 'openai/o3-mini',
    tokenLimit: 20000,
    price: 25,
    name: 'PRO Tier'
  },
  ultra: {
    apiKey: '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',
    model: 'openai/gpt-4o:extended',
    tokenLimit: 50000,
    price: 125,
    name: 'ULTRA Tier'
  }
};

export const getApiKey = (tier: SubscriptionTier = 'free'): string => {
  // Check localStorage first for tier-specific keys
  const storageKey = `OPENROUTER_API_KEY_${tier.toUpperCase()}`;
  const storedKey = localStorage.getItem(storageKey);
  
  if (storedKey) {
    return storedKey;
  }
  
  // Fallback to hardcoded configuration
  return TIER_CONFIGS[tier].apiKey;
};

export const getModelForTier = (tier: SubscriptionTier = 'free'): string => {
  return TIER_CONFIGS[tier].model;
};

export const getTierConfig = (tier: SubscriptionTier = 'free'): TierConfig => {
  return TIER_CONFIGS[tier];
};

export const hasAnyApiKey = (): boolean => {
  return !!(
    localStorage.getItem('VITE_OPENROUTER_API_KEY') ||
    localStorage.getItem('OPENROUTER_API_KEY_FREE') ||
    localStorage.getItem('OPENROUTER_API_KEY_PRO') ||
    localStorage.getItem('OPENROUTER_API_KEY_ULTRA')
  );
};

export const getUserTier = (): SubscriptionTier => {
  // This should eventually check the user's subscription status from Supabase
  // For now, default to free tier
  const storedTier = localStorage.getItem('USER_SUBSCRIPTION_TIER') as SubscriptionTier;
  return storedTier || 'free';
};

export const setUserTier = (tier: SubscriptionTier): void => {
  localStorage.setItem('USER_SUBSCRIPTION_TIER', tier);
};

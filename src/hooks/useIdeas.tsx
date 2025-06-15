
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Idea {
  id: string;
  title: string;
  description: string;
  rating?: number;
  swot_analysis?: any;
  niches?: any;
  digital_products?: any;
  monetization_paths?: any;
  mvp_recommendation?: string;
  created_at: string;
}

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchIdeas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveIdea = async (ideaData: {
    title: string;
    description: string;
    rating?: number;
    swot_analysis?: any;
    niches?: any;
    digital_products?: any;
    monetization_paths?: any;
    mvp_recommendation?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            ...ideaData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setIdeas(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error saving idea:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchIdeas();
    } else {
      setIdeas([]);
    }
  }, [user]);

  return {
    ideas,
    loading,
    saveIdea,
    refetch: fetchIdeas
  };
};


-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ideas table to store user ideas and analysis
CREATE TABLE public.ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  swot_analysis JSONB,
  niches JSONB,
  digital_products JSONB,
  monetization_paths JSONB,
  mvp_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clarity_sessions table for Clarity Coach Mode
CREATE TABLE public.clarity_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  goal TEXT,
  blocking_factors TEXT,
  skills_assets TEXT,
  weekly_plan JSONB,
  mindset_advice TEXT,
  productivity_tip TEXT,
  pep_talk TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create niche_validations table for Niche Validation & Audience Map
CREATE TABLE public.niche_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas ON DELETE CASCADE,
  profitable_niches JSONB,
  micro_products JSONB,
  selling_platforms JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_models table for Business Model Generator
CREATE TABLE public.business_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas ON DELETE CASCADE,
  monetization_paths JSONB,
  pricing_tiers JSONB,
  weekend_mvp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clarity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_models ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for ideas table
CREATE POLICY "Users can view own ideas" ON public.ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas" ON public.ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON public.ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON public.ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for clarity_sessions table
CREATE POLICY "Users can view own clarity sessions" ON public.clarity_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clarity sessions" ON public.clarity_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clarity sessions" ON public.clarity_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clarity sessions" ON public.clarity_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for niche_validations table
CREATE POLICY "Users can view own niche validations" ON public.niche_validations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own niche validations" ON public.niche_validations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own niche validations" ON public.niche_validations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own niche validations" ON public.niche_validations
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for business_models table
CREATE POLICY "Users can view own business models" ON public.business_models
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business models" ON public.business_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business models" ON public.business_models
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business models" ON public.business_models
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

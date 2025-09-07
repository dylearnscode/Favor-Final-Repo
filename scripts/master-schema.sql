-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exchange_posts table
CREATE TABLE IF NOT EXISTS public.exchange_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_negotiability TEXT CHECK (price_negotiability IN ('negotiable', 'non-negotiable')) DEFAULT 'non-negotiable',
    category TEXT CHECK (category IN ('Concert Tickets', 'Dorm Items', 'Preprofessional Help', 'Food Truck Line Service')) NOT NULL,
    duration_days INTEGER NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'completed')) DEFAULT 'active',
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exchange_posts_user_id ON public.exchange_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_category ON public.exchange_posts(category);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_status ON public.exchange_posts(status);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_expires_at ON public.exchange_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_created_at ON public.exchange_posts(created_at);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can view active exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Users can insert their own exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Users can update their own exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Users can delete their own exchange posts" ON public.exchange_posts;

-- RLS Policies for user_profiles - Allow all authenticated users to read profiles
CREATE POLICY "Enable read access for all users" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for exchange_posts
CREATE POLICY "Enable read access for all users" ON public.exchange_posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.exchange_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON public.exchange_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.exchange_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Function to handle automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName')
    );
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically delete expired posts
CREATE OR REPLACE FUNCTION public.cleanup_expired_posts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.exchange_posts 
    WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set expires_at automatically
CREATE OR REPLACE FUNCTION public.set_expires_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expires_at = NEW.created_at + (NEW.duration_days || ' days')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expires_at on insert
DROP TRIGGER IF EXISTS set_expires_at_trigger ON public.exchange_posts;
CREATE TRIGGER set_expires_at_trigger
    BEFORE INSERT ON public.exchange_posts
    FOR EACH ROW EXECUTE FUNCTION public.set_expires_at();

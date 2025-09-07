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

-- Create rideshare_posts table
CREATE TABLE IF NOT EXISTS public.rideshare_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    departure_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    available_seats INTEGER NOT NULL CHECK (available_seats > 0),
    price_per_person DECIMAL(10,2) NOT NULL CHECK (price_per_person >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create academic_posts table
CREATE TABLE IF NOT EXISTS public.academic_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    department TEXT NOT NULL,
    course TEXT NOT NULL,
    title TEXT NOT NULL,
    resource TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    popularity INTEGER DEFAULT 0,
    file_size INTEGER,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participant_1 UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    participant_2 UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_1, participant_2)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

CREATE INDEX IF NOT EXISTS idx_exchange_posts_user_id ON public.exchange_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_category ON public.exchange_posts(category);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_status ON public.exchange_posts(status);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_expires_at ON public.exchange_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_created_at ON public.exchange_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_rideshare_posts_user_id ON public.rideshare_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_departure_time ON public.rideshare_posts(departure_time);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_created_at ON public.rideshare_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_academic_posts_user_id ON public.academic_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_posts_department ON public.academic_posts(department);
CREATE INDEX IF NOT EXISTS idx_academic_posts_course ON public.academic_posts(course);
CREATE INDEX IF NOT EXISTS idx_academic_posts_created_at ON public.academic_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON public.conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON public.conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- Disable Row Level Security to fix permission issues
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rideshare_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view all exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Users can create exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Users can update own exchange posts" ON public.exchange_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exchange_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.exchange_posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.exchange_posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.exchange_posts;

-- Grant necessary permissions to fix access issues
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.exchange_posts TO anon, authenticated;
GRANT ALL ON public.rideshare_posts TO anon, authenticated;
GRANT ALL ON public.academic_posts TO anon, authenticated;
GRANT ALL ON public.conversations TO anon, authenticated;
GRANT ALL ON public.messages TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

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

-- Function to update last_message_at in conversations
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when message is sent
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON public.messages;
CREATE TRIGGER update_conversation_timestamp_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

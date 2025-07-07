-- =============================================
-- COMPLETE FAVOR APP DATABASE SCHEMA
-- =============================================
-- This script will create all tables needed for the Favor app
-- including user auth, rideshare, messaging, academic posts, and more

-- Drop existing tables (destructive - be careful!)
DROP TABLE IF EXISTS public.message_participants CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.rideshare_requests CASCADE;
DROP TABLE IF EXISTS public.rideshare_posts CASCADE;
DROP TABLE IF EXISTS public.academic_posts CASCADE;
DROP TABLE IF EXISTS public.favor_requests CASCADE;
DROP TABLE IF EXISTS public.favor_posts CASCADE;
DROP TABLE IF EXISTS public.user_ratings CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone_number TEXT,
    year_in_school TEXT CHECK (year_in_school IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD')),
    major TEXT,
    dorm_building TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    is_active BOOLEAN DEFAULT true,
    total_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT email_format CHECK (email ~ '^[a-zA-Z0-9._%+-]+@g\.ucla\.edu$')
);

-- Add updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- USER RATINGS TABLE
-- =============================================
CREATE TABLE public.user_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rater_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    rated_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('rideshare', 'academic', 'favor', 'general')),
    transaction_id UUID, -- Reference to specific post/request
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(rater_id, rated_user_id, transaction_id)
);

-- =============================================
-- ACADEMIC POSTS TABLE
-- =============================================
CREATE TABLE public.academic_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    department TEXT NOT NULL,
    course TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('notes', 'study_guide', 'practice_exam', 'textbook', 'other')),
    pdf_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    tags TEXT[], -- Array of tags
    popularity INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_academic_posts_updated_at
    BEFORE UPDATE ON public.academic_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RIDESHARE POSTS TABLE
-- =============================================
CREATE TABLE public.rideshare_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('offering', 'requesting')),
    departure_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    return_time TIMESTAMP WITH TIME ZONE,
    is_round_trip BOOLEAN DEFAULT false,
    available_seats INTEGER CHECK (available_seats > 0),
    price_per_person DECIMAL(10,2),
    car_info TEXT,
    additional_notes TEXT,
    contact_method TEXT DEFAULT 'app' CHECK (contact_method IN ('app', 'phone', 'email')),
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_rideshare_posts_updated_at
    BEFORE UPDATE ON public.rideshare_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RIDESHARE REQUESTS TABLE
-- =============================================
CREATE TABLE public.rideshare_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.rideshare_posts(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    seats_requested INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(post_id, requester_id)
);

-- Add updated_at trigger
CREATE TRIGGER update_rideshare_requests_updated_at
    BEFORE UPDATE ON public.rideshare_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FAVOR POSTS TABLE
-- =============================================
CREATE TABLE public.favor_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('offering', 'requesting')),
    category TEXT NOT NULL CHECK (category IN ('food_delivery', 'grocery_shopping', 'package_pickup', 'tutoring', 'cleaning', 'moving_help', 'other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    compensation DECIMAL(10,2),
    compensation_type TEXT CHECK (compensation_type IN ('money', 'trade', 'free')),
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    estimated_duration TEXT,
    preferred_time TEXT,
    contact_method TEXT DEFAULT 'app' CHECK (contact_method IN ('app', 'phone', 'email')),
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_favor_posts_updated_at
    BEFORE UPDATE ON public.favor_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FAVOR REQUESTS TABLE
-- =============================================
CREATE TABLE public.favor_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.favor_posts(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    proposed_compensation DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(post_id, requester_id)
);

-- Add updated_at trigger
CREATE TRIGGER update_favor_requests_updated_at
    BEFORE UPDATE ON public.favor_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CONVERSATIONS TABLE
-- =============================================
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    conversation_type TEXT DEFAULT 'direct' CHECK (conversation_type IN ('direct', 'group')),
    title TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- MESSAGE PARTICIPANTS TABLE
-- =============================================
CREATE TABLE public.message_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(conversation_id, user_id)
);

-- =============================================
-- MESSAGES TABLE
-- =============================================
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_verification_status ON public.user_profiles(verification_status);

-- Academic posts indexes
CREATE INDEX idx_academic_posts_user_id ON public.academic_posts(user_id);
CREATE INDEX idx_academic_posts_department ON public.academic_posts(department);
CREATE INDEX idx_academic_posts_course ON public.academic_posts(course);
CREATE INDEX idx_academic_posts_created_at ON public.academic_posts(created_at DESC);
CREATE INDEX idx_academic_posts_popularity ON public.academic_posts(popularity DESC);
CREATE INDEX idx_academic_posts_active ON public.academic_posts(is_active);

-- Rideshare posts indexes
CREATE INDEX idx_rideshare_posts_user_id ON public.rideshare_posts(user_id);
CREATE INDEX idx_rideshare_posts_departure_time ON public.rideshare_posts(departure_time);
CREATE INDEX idx_rideshare_posts_active ON public.rideshare_posts(is_active);
CREATE INDEX idx_rideshare_posts_type ON public.rideshare_posts(post_type);

-- Favor posts indexes
CREATE INDEX idx_favor_posts_user_id ON public.favor_posts(user_id);
CREATE INDEX idx_favor_posts_category ON public.favor_posts(category);
CREATE INDEX idx_favor_posts_active ON public.favor_posts(is_active);
CREATE INDEX idx_favor_posts_urgency ON public.favor_posts(urgency);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Conversations indexes
CREATE INDEX idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rideshare_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User ratings policies
CREATE POLICY "Users can view all ratings" ON public.user_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert ratings" ON public.user_ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);
CREATE POLICY "Users can update own ratings" ON public.user_ratings FOR UPDATE USING (auth.uid() = rater_id);

-- Academic posts policies
CREATE POLICY "Users can view all academic posts" ON public.academic_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own academic posts" ON public.academic_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own academic posts" ON public.academic_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own academic posts" ON public.academic_posts FOR DELETE USING (auth.uid() = user_id);

-- Rideshare posts policies
CREATE POLICY "Users can view all rideshare posts" ON public.rideshare_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own rideshare posts" ON public.rideshare_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rideshare posts" ON public.rideshare_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rideshare posts" ON public.rideshare_posts FOR DELETE USING (auth.uid() = user_id);

-- Rideshare requests policies
CREATE POLICY "Users can view rideshare requests for their posts" ON public.rideshare_requests FOR SELECT USING (
    auth.uid() = requester_id OR 
    auth.uid() IN (SELECT user_id FROM public.rideshare_posts WHERE id = post_id)
);
CREATE POLICY "Users can insert rideshare requests" ON public.rideshare_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update rideshare requests" ON public.rideshare_requests FOR UPDATE USING (
    auth.uid() = requester_id OR 
    auth.uid() IN (SELECT user_id FROM public.rideshare_posts WHERE id = post_id)
);

-- Favor posts policies
CREATE POLICY "Users can view all favor posts" ON public.favor_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own favor posts" ON public.favor_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own favor posts" ON public.favor_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own favor posts" ON public.favor_posts FOR DELETE USING (auth.uid() = user_id);

-- Favor requests policies
CREATE POLICY "Users can view favor requests for their posts" ON public.favor_requests FOR SELECT USING (
    auth.uid() = requester_id OR 
    auth.uid() IN (SELECT user_id FROM public.favor_posts WHERE id = post_id)
);
CREATE POLICY "Users can insert favor requests" ON public.favor_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update favor requests" ON public.favor_requests FOR UPDATE USING (
    auth.uid() = requester_id OR 
    auth.uid() IN (SELECT user_id FROM public.favor_posts WHERE id = post_id)
);

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in" ON public.conversations FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() IN (SELECT user_id FROM public.message_participants WHERE conversation_id = id)
);
CREATE POLICY "Users can insert conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update conversations they created" ON public.conversations FOR UPDATE USING (auth.uid() = created_by);

-- Message participants policies
CREATE POLICY "Users can view participants in their conversations" ON public.message_participants FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.message_participants mp2 WHERE mp2.conversation_id = conversation_id)
);
CREATE POLICY "Users can insert themselves as participants" ON public.message_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own participation" ON public.message_participants FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.message_participants WHERE conversation_id = messages.conversation_id)
);
CREATE POLICY "Users can insert messages in their conversations" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND 
    auth.uid() IN (SELECT user_id FROM public.message_participants WHERE conversation_id = messages.conversation_id)
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- =============================================
-- FUNCTIONS FOR USER MANAGEMENT
-- =============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample academic posts (only if you want test data)
INSERT INTO public.academic_posts (user_id, department, course, title, description, resource_type, pdf_url, is_free, tags, popularity) VALUES
(
    (SELECT id FROM auth.users LIMIT 1), -- Use first user if exists
    'Computer Science (CS)', 
    'CS 31', 
    'Introduction to Computer Science I', 
    'Comprehensive midterm practice questions with solutions',
    'practice_exam',
    'https://web.cs.ucla.edu/classes/fall23/cs31/Exams/midterm_practice.pdf',
    true,
    ARRAY['midterm', 'practice', 'cs31'],
    95
) ON CONFLICT DO NOTHING;

-- =============================================
-- FINAL SETUP
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';

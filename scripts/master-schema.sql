-- ===================================
-- NUCLEAR OPTION - DROPS EVERYTHING
-- ===================================

-- Drop the entire public schema and recreate it
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Restore default permissions for public schema
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';

-- ===================================
-- FRESH SCHEMA CREATION
-- ===================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'admin', 'moderator');
CREATE TYPE post_status AS ENUM ('active', 'inactive', 'deleted', 'full', 'completed', 'cancelled');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'disputed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE post_type AS ENUM ('question', 'study_group', 'resource', 'tutoring');
CREATE TYPE favor_type AS ENUM ('request', 'offer');
CREATE TYPE exchange_category AS ENUM ('Concert Tickets', 'Dorm Items', 'Preprofessional Help', 'Food Truck Line Service');
CREATE TYPE price_negotiability AS ENUM ('negotiable', 'non-negotiable');

-- User profiles table (consolidated from auth-schema and complete-schema)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic posts table (consolidated from supabase-schema and complete-schema)
CREATE TABLE academic_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department VARCHAR(100) NOT NULL,
    course VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    pdf_url TEXT NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    uploaded_by VARCHAR(255),
    upload_date VARCHAR(50),
    popularity INTEGER DEFAULT 0,
    file_size INTEGER,
    file_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rideshare posts table (consolidated from supabase-schema-update and complete-schema)
CREATE TABLE rideshare_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    destination VARCHAR(255),
    departure_time TIMESTAMP WITH TIME ZONE,
    available_seats INTEGER DEFAULT 1,
    max_participants INTEGER DEFAULT 4,
    participants INTEGER DEFAULT 1,
    price_per_person VARCHAR(50),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organizer VARCHAR(255),
    reason TEXT,
    date DATE,
    time TIME,
    datetime TIMESTAMP WITH TIME ZONE,
    match_strength INTEGER,
    distance VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange posts table (UPDATED)
CREATE TABLE exchange_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_negotiability price_negotiability DEFAULT 'non-negotiable',
    category exchange_category NOT NULL,
    duration_days INTEGER NOT NULL,
    status post_status DEFAULT 'active',
    rating DECIMAL(3,2) DEFAULT NULL,
    review_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favor posts table (from complete-schema)
CREATE TABLE favor_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    favor_type favor_type NOT NULL,
    location VARCHAR(200),
    compensation TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    status post_status DEFAULT 'active',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table (consolidated from messaging-schema and complete-schema)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_1, participant_2)
);

-- Conversation members table (from messaging-schema)
CREATE TABLE conversation_members (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages table (consolidated from messaging-schema and complete-schema)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    attachment_url TEXT,
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    reply_to UUID REFERENCES messages(id),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    post_id UUID, -- Can reference different post types
    post_type VARCHAR(50) NOT NULL, -- 'exchange', 'rideshare', etc.
    amount DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(100),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews/Ratings table (consolidated from complete-schema)
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    rated_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    context_type VARCHAR(50),
    context_id UUID,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rater_id, rated_id, context_type, context_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_id UUID, -- Can reference different entities
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reported_post_id UUID, -- Can reference different post types
    post_type VARCHAR(50),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_by UUID REFERENCES user_profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_academic_posts_department ON academic_posts(department);
CREATE INDEX idx_academic_posts_course ON academic_posts(course);
CREATE INDEX idx_academic_posts_popularity ON academic_posts(popularity DESC);
CREATE INDEX idx_rideshare_posts_departure_time ON rideshare_posts(departure_time);
CREATE INDEX idx_rideshare_posts_destination ON rideshare_posts(destination);
CREATE INDEX idx_exchange_posts_category ON exchange_posts(category);
CREATE INDEX idx_exchange_posts_status ON exchange_posts(status);
CREATE INDEX idx_exchange_posts_expires_at ON exchange_posts(expires_at);
CREATE INDEX idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Academic posts: Everyone can read, authenticated users can insert
CREATE POLICY "Academic posts are viewable by everyone" ON academic_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert academic posts" ON academic_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own academic posts" ON academic_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Rideshare posts: Everyone can read, authenticated users can insert
CREATE POLICY "Rideshare posts are viewable by everyone" ON rideshare_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert rideshare posts" ON rideshare_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own rideshare posts" ON rideshare_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Exchange posts: Everyone can read active posts, authenticated users can insert
CREATE POLICY "Active exchange posts are viewable by everyone" ON exchange_posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can insert exchange posts" ON exchange_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own exchange posts" ON exchange_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Conversations: Users can only see conversations they participate in
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages: Users can only see messages in conversations they participate in
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
        )
    );

CREATE POLICY "Users can insert messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
        )
    );

CREATE POLICY "Users can update messages they sent" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Function to automatically create user profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update conversation last_message_at when new message is sent
CREATE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation timestamp
CREATE TRIGGER on_message_created
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- Function to set expires_at based on duration_days
CREATE FUNCTION public.set_exchange_post_expiry()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expires_at = NEW.created_at + (NEW.duration_days || ' days')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expiry date on exchange post creation
CREATE TRIGGER set_exchange_post_expiry_trigger
    BEFORE INSERT ON exchange_posts
    FOR EACH ROW EXECUTE FUNCTION public.set_exchange_post_expiry();

-- Function to auto-delete expired exchange posts
CREATE FUNCTION public.delete_expired_exchange_posts()
RETURNS void AS $$
BEGIN
    DELETE FROM exchange_posts 
    WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: You'll need to set up a cron job or scheduled function to call delete_expired_exchange_posts() periodically

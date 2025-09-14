-- Fix missing columns and relationships in the database schema

-- Add missing column to rideshare_posts table
ALTER TABLE rideshare_posts 
ADD COLUMN IF NOT EXISTS from_location TEXT;

-- Update existing records to use departure_location as from_location if needed
UPDATE rideshare_posts 
SET from_location = departure_location 
WHERE from_location IS NULL;

-- Enable Row Level Security on all tables if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for user_profiles
CREATE POLICY IF NOT EXISTS "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create basic RLS policies for rideshare_posts
CREATE POLICY IF NOT EXISTS "Anyone can view rideshare posts" ON rideshare_posts
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can create rideshare posts" ON rideshare_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own rideshare posts" ON rideshare_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Create basic RLS policies for academic_posts
CREATE POLICY IF NOT EXISTS "Anyone can view academic posts" ON academic_posts
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can create academic posts" ON academic_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own academic posts" ON academic_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Create basic RLS policies for exchange_posts
CREATE POLICY IF NOT EXISTS "Anyone can view exchange posts" ON exchange_posts
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can create exchange posts" ON exchange_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own exchange posts" ON exchange_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Create basic RLS policies for conversations
CREATE POLICY IF NOT EXISTS "Users can view own conversations" ON conversations
    FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY IF NOT EXISTS "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Create basic RLS policies for messages
CREATE POLICY IF NOT EXISTS "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
        )
    );

CREATE POLICY IF NOT EXISTS "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
        )
    );

-- DESTRUCTIVE RESET - WARNING: This will delete the ENTIRE schema and ALL data
-- Option 1: Drop and recreate the entire schema (most powerful reset)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Option 2: Alternative - Drop specific schema if using custom schema
-- DROP SCHEMA IF EXISTS rideshare_app CASCADE;
-- CREATE SCHEMA rideshare_app;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types first
CREATE TYPE exchange_category AS ENUM ('Concert Tickets', 'Dorm Items', 'Preprofessional Help', 'Food Truck Line Service');
CREATE TYPE price_negotiability AS ENUM ('negotiable', 'non-negotiable');
CREATE TYPE post_status AS ENUM ('active', 'inactive', 'expired');

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rideshare posts table
CREATE TABLE rideshare_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  departure_location VARCHAR(255) NOT NULL,
  -- Added from_location column from fix-database-schema.sql
  from_location TEXT,
  destination VARCHAR(255) NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats > 0),
  price_per_person DECIMAL(10,2) NOT NULL CHECK (price_per_person >= 0),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic posts table
CREATE TABLE academic_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  pdf_url TEXT NOT NULL,
  user_id UUID NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
  file_type VARCHAR(50)
);

-- Exchange posts table
CREATE TABLE exchange_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  price_negotiability price_negotiability NOT NULL DEFAULT 'non-negotiable',
  category exchange_category NOT NULL,
  user_id UUID NOT NULL,
  status post_status NOT NULL DEFAULT 'active',
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT participants_not_equal CHECK (participant_1 != participant_2),
  CONSTRAINT unique_conversation UNIQUE(participant_1, participant_2)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Add explicit foreign key constraints with names for Supabase schema cache
ALTER TABLE rideshare_posts 
ADD CONSTRAINT rideshare_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE academic_posts 
ADD CONSTRAINT academic_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE exchange_posts 
ADD CONSTRAINT exchange_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Function to automatically set expires_at based on duration_days
CREATE OR REPLACE FUNCTION set_exchange_post_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at = NEW.created_at + (NEW.duration_days || ' days')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set expiry date on insert
CREATE TRIGGER set_exchange_post_expiry_trigger
  BEFORE INSERT ON exchange_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_exchange_post_expiry();

-- Function to auto-delete expired posts
CREATE OR REPLACE FUNCTION delete_expired_exchange_posts()
RETURNS void AS $$
BEGIN
  DELETE FROM exchange_posts 
  WHERE expires_at < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX idx_rideshare_posts_user_id ON rideshare_posts(user_id);
CREATE INDEX idx_rideshare_posts_departure_time ON rideshare_posts(departure_time);
CREATE INDEX idx_rideshare_posts_departure_location ON rideshare_posts(departure_location);
CREATE INDEX idx_academic_posts_user_id ON academic_posts(user_id);
CREATE INDEX idx_academic_posts_department ON academic_posts(department);
CREATE INDEX idx_academic_posts_course ON academic_posts(course);
CREATE INDEX idx_academic_posts_popularity ON academic_posts(popularity DESC);
CREATE INDEX idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_exchange_posts_user_id ON exchange_posts(user_id);
CREATE INDEX idx_exchange_posts_category ON exchange_posts(category);
CREATE INDEX idx_exchange_posts_status ON exchange_posts(status);
CREATE INDEX idx_exchange_posts_expires_at ON exchange_posts(expires_at);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Rideshare posts policies
DROP POLICY IF EXISTS "Anyone can view rideshare posts" ON rideshare_posts;
CREATE POLICY "Anyone can view rideshare posts" ON rideshare_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create rideshare posts" ON rideshare_posts;
CREATE POLICY "Users can create rideshare posts" ON rideshare_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own rideshare posts" ON rideshare_posts;
CREATE POLICY "Users can update own rideshare posts" ON rideshare_posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own rideshare posts" ON rideshare_posts;
CREATE POLICY "Users can delete own rideshare posts" ON rideshare_posts FOR DELETE USING (auth.uid() = user_id);

-- Academic posts policies
DROP POLICY IF EXISTS "Anyone can view academic posts" ON academic_posts;
CREATE POLICY "Anyone can view academic posts" ON academic_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create academic posts" ON academic_posts;
CREATE POLICY "Users can create academic posts" ON academic_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own academic posts" ON academic_posts;
CREATE POLICY "Users can update own academic posts" ON academic_posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own academic posts" ON academic_posts;
CREATE POLICY "Users can delete own academic posts" ON academic_posts FOR DELETE USING (auth.uid() = user_id);

-- Exchange posts policies
DROP POLICY IF EXISTS "Anyone can view exchange posts" ON exchange_posts;
CREATE POLICY "Anyone can view exchange posts" ON exchange_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create exchange posts" ON exchange_posts;
CREATE POLICY "Users can create exchange posts" ON exchange_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own exchange posts" ON exchange_posts;
CREATE POLICY "Users can update own exchange posts" ON exchange_posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own exchange posts" ON exchange_posts;
CREATE POLICY "Users can delete own exchange posts" ON exchange_posts FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
  )
);
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
  )
);

-- Function to update conversation last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Add trigger to sync auth.users with user_profiles automatically
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, username)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rideshare posts table
CREATE TABLE IF NOT EXISTS rideshare_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  departure_location VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats > 0),
  price_per_person DECIMAL(10,2) NOT NULL CHECK (price_per_person >= 0),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic posts table
CREATE TABLE IF NOT EXISTS academic_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  pdf_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
  file_type VARCHAR(50)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Exchange posts table
CREATE TYPE exchange_category AS ENUM ('Concert Tickets', 'Dorm Items', 'Preprofessional Help', 'Food Truck Line Service');
CREATE TYPE price_negotiability AS ENUM ('negotiable', 'non-negotiable');
CREATE TYPE post_status AS ENUM ('active', 'inactive', 'expired');

CREATE TABLE IF NOT EXISTS exchange_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  price_negotiability price_negotiability NOT NULL DEFAULT 'non-negotiable',
  category exchange_category NOT NULL,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status post_status NOT NULL DEFAULT 'active',
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_user_id ON rideshare_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_departure_time ON rideshare_posts(departure_time);
CREATE INDEX IF NOT EXISTS idx_academic_posts_user_id ON academic_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_posts_department ON academic_posts(department);
CREATE INDEX IF NOT EXISTS idx_academic_posts_course ON academic_posts(course);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_user_id ON exchange_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_category ON exchange_posts(category);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_status ON exchange_posts(status);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_expires_at ON exchange_posts(expires_at);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Rideshare posts policies
CREATE POLICY "Anyone can view rideshare posts" ON rideshare_posts FOR SELECT USING (true);
CREATE POLICY "Users can create rideshare posts" ON rideshare_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rideshare posts" ON rideshare_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rideshare posts" ON rideshare_posts FOR DELETE USING (auth.uid() = user_id);

-- Academic posts policies
CREATE POLICY "Anyone can view academic posts" ON academic_posts FOR SELECT USING (true);
CREATE POLICY "Users can create academic posts" ON academic_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own academic posts" ON academic_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own academic posts" ON academic_posts FOR DELETE USING (auth.uid() = user_id);

-- Exchange posts policies
CREATE POLICY "Anyone can view active exchange posts" ON exchange_posts FOR SELECT USING (status = 'active' AND expires_at > NOW());
CREATE POLICY "Users can create exchange posts" ON exchange_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exchange posts" ON exchange_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exchange posts" ON exchange_posts FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages policies
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
  )
);
CREATE POLICY "Users can send messages in own conversations" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
  )
);

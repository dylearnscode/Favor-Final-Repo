-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create academic_posts table
CREATE TABLE IF NOT EXISTS academic_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  department TEXT,
  course_code TEXT,
  post_type TEXT CHECK (post_type IN ('question', 'study_group', 'resource', 'tutoring')) NOT NULL,
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rideshare_posts table
CREATE TABLE IF NOT EXISTS rideshare_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  departure_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats > 0),
  price_per_person DECIMAL(10,2),
  contact_info TEXT,
  status TEXT CHECK (status IN ('active', 'full', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favor_posts table
CREATE TABLE IF NOT EXISTS favor_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  favor_type TEXT CHECK (favor_type IN ('request', 'offer')) NOT NULL,
  location TEXT,
  compensation TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')) DEFAULT 'active',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_1 UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  attachment_url TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rater_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rated_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  context_type TEXT CHECK (context_type IN ('rideshare', 'favor', 'academic')) NOT NULL,
  context_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rater_id, rated_id, context_type, context_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_academic_posts_user_id ON academic_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_posts_department ON academic_posts(department);
CREATE INDEX IF NOT EXISTS idx_academic_posts_post_type ON academic_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_academic_posts_created_at ON academic_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rideshare_posts_user_id ON rideshare_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_departure_time ON rideshare_posts(departure_time);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_status ON rideshare_posts(status);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_created_at ON rideshare_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favor_posts_user_id ON favor_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_favor_posts_category ON favor_posts(category);
CREATE INDEX IF NOT EXISTS idx_favor_posts_favor_type ON favor_posts(favor_type);
CREATE INDEX IF NOT EXISTS idx_favor_posts_status ON favor_posts(status);
CREATE INDEX IF NOT EXISTS idx_favor_posts_created_at ON favor_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_ratings_context_type ON ratings(context_type);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for academic_posts
CREATE POLICY "Anyone can view academic posts" ON academic_posts FOR SELECT USING (true);
CREATE POLICY "Users can create academic posts" ON academic_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own academic posts" ON academic_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own academic posts" ON academic_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for rideshare_posts
CREATE POLICY "Anyone can view rideshare posts" ON rideshare_posts FOR SELECT USING (true);
CREATE POLICY "Users can create rideshare posts" ON rideshare_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rideshare posts" ON rideshare_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rideshare posts" ON rideshare_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for favor_posts
CREATE POLICY "Anyone can view favor posts" ON favor_posts FOR SELECT USING (true);
CREATE POLICY "Users can create favor posts" ON favor_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own favor posts" ON favor_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own favor posts" ON favor_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (
  auth.uid() = participant_1 OR auth.uid() = participant_2
);

-- RLS Policies for messages
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

-- RLS Policies for ratings
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = rater_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_posts_updated_at BEFORE UPDATE ON academic_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rideshare_posts_updated_at BEFORE UPDATE ON rideshare_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_favor_posts_updated_at BEFORE UPDATE ON favor_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_last_message_trigger 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_last_message();

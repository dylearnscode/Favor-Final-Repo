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

-- User profiles table (consolidated from auth-schema and complete-schema)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    university VARCHAR(100) DEFAULT 'UCLA',
    graduation_year INTEGER,
    major VARCHAR(100),
    role user_role DEFAULT 'student',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Academic posts table (consolidated from supabase-schema and complete-schema)
CREATE TABLE IF NOT EXISTS academic_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    course VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    resource VARCHAR(200) NOT NULL,
    content TEXT,
    description TEXT,
    pdf_url TEXT NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    upload_date VARCHAR(50) DEFAULT 'Just now',
    popularity INTEGER DEFAULT 0,
    file_type VARCHAR(100),
    file_size BIGINT,
    download_count INTEGER DEFAULT 0,
    status post_status DEFAULT 'active',
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    post_type post_type DEFAULT 'resource',
    course_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rideshare posts table (consolidated from supabase-schema-update and complete-schema)
CREATE TABLE IF NOT EXISTS rideshare_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    from_location VARCHAR(200),
    to_location VARCHAR(200),
    destination VARCHAR(200) NOT NULL,
    departure_location VARCHAR(200),
    reason TEXT,
    description TEXT,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 4,
    participants INTEGER DEFAULT 1,
    available_seats INTEGER NOT NULL DEFAULT 3,
    price_per_person DECIMAL(10,2) DEFAULT 0.00,
    organizer VARCHAR(100) NOT NULL,
    match_strength INTEGER DEFAULT 0,
    distance VARCHAR(50),
    to_lat DECIMAL(10,8),
    to_lon DECIMAL(11,8),
    from_lat DECIMAL(10,8),
    from_lon DECIMAL(11,8),
    contact_info TEXT,
    status post_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange posts table
CREATE TABLE IF NOT EXISTS exchange_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    condition VARCHAR(50) DEFAULT 'good',
    location VARCHAR(200),
    images TEXT[],
    tags TEXT[],
    is_negotiable BOOLEAN DEFAULT TRUE,
    status post_status DEFAULT 'active',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favor posts table (from complete-schema)
CREATE TABLE IF NOT EXISTS favor_posts (
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
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_1 UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    participant_2 UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    last_message_id UUID,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_1, participant_2)
);

-- Conversation members table (from messaging-schema)
CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Messages table (consolidated from messaging-schema and complete-schema)
CREATE TABLE IF NOT EXISTS messages (
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
CREATE TABLE IF NOT EXISTS transactions (
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
CREATE TABLE IF NOT EXISTS ratings (
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
CREATE TABLE IF NOT EXISTS notifications (
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
CREATE TABLE IF NOT EXISTS reports (
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
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_university ON user_profiles(university);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_academic_posts_user_id ON academic_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_posts_department ON academic_posts(department);
CREATE INDEX IF NOT EXISTS idx_academic_posts_course ON academic_posts(course);
CREATE INDEX IF NOT EXISTS idx_academic_posts_status ON academic_posts(status);
CREATE INDEX IF NOT EXISTS idx_academic_posts_created_at ON academic_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academic_posts_popularity ON academic_posts(popularity);
CREATE INDEX IF NOT EXISTS idx_academic_posts_post_type ON academic_posts(post_type);

CREATE INDEX IF NOT EXISTS idx_rideshare_posts_user_id ON rideshare_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_departure_time ON rideshare_posts(departure_time);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_destination ON rideshare_posts(destination);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_status ON rideshare_posts(status);
CREATE INDEX IF NOT EXISTS idx_rideshare_posts_created_at ON rideshare_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exchange_posts_user_id ON exchange_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_category ON exchange_posts(category);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_status ON exchange_posts(status);
CREATE INDEX IF NOT EXISTS idx_exchange_posts_created_at ON exchange_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favor_posts_user_id ON favor_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_favor_posts_category ON favor_posts(category);
CREATE INDEX IF NOT EXISTS idx_favor_posts_favor_type ON favor_posts(favor_type);
CREATE INDEX IF NOT EXISTS idx_favor_posts_status ON favor_posts(status);
CREATE INDEX IF NOT EXISTS idx_favor_posts_created_at ON favor_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_members_user_id ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_conversation_id ON conversation_members(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewer_id ON ratings(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewee_id ON ratings(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_ratings_transaction_id ON ratings(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ratings_context_type ON ratings(context_type);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to handle user profile updates (from auth-schema)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update conversation timestamp (from messaging-schema)
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update conversation last_message_at (from complete-schema)
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create all triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_academic_posts_updated_at BEFORE UPDATE ON academic_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rideshare_posts_updated_at BEFORE UPDATE ON rideshare_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchange_posts_updated_at BEFORE UPDATE ON exchange_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_favor_posts_updated_at BEFORE UPDATE ON favor_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Conversation timestamp triggers
CREATE TRIGGER update_conversation_timestamp_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

CREATE TRIGGER update_conversation_last_message_trigger 
    AFTER INSERT ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conversation_last_message();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies (from auth-schema and complete-schema)
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Academic posts policies
CREATE POLICY "Anyone can view academic posts" ON academic_posts FOR SELECT USING (true);
CREATE POLICY "Users can create academic posts" ON academic_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own academic posts" ON academic_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own academic posts" ON academic_posts FOR DELETE USING (auth.uid() = user_id);

-- Rideshare posts policies
CREATE POLICY "Anyone can view rideshare posts" ON rideshare_posts FOR SELECT USING (true);
CREATE POLICY "Users can create rideshare posts" ON rideshare_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rideshare posts" ON rideshare_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rideshare posts" ON rideshare_posts FOR DELETE USING (auth.uid() = user_id);

-- Exchange posts policies
CREATE POLICY "Anyone can view active exchange posts" ON exchange_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own exchange posts" ON exchange_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exchange posts" ON exchange_posts FOR UPDATE USING (auth.uid() = user_id);

-- Favor posts policies
CREATE POLICY "Anyone can view favor posts" ON favor_posts FOR SELECT USING (true);
CREATE POLICY "Users can create favor posts" ON favor_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own favor posts" ON favor_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own favor posts" ON favor_posts FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies (from messaging-schema and complete-schema)
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Conversation members policies
CREATE POLICY "Users can view conversation members for their conversations" ON conversation_members FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_members 
      WHERE user_id = auth.uid()
    )
  );

-- Messages policies (consolidated from messaging-schema and complete-schema)
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE conversations.id = messages.conversation_id 
        AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
);
CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM conversations 
        WHERE conversations.id = messages.conversation_id 
        AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can insert transactions they participate in" ON transactions FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Ratings policies
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id OR auth.uid() = reviewer_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = rater_id OR auth.uid() = reviewer_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can insert reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Create storage bucket for academic files (from supabase-schema-update)
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-files', 'academic-files', true) ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view academic files" ON storage.objects FOR SELECT USING (bucket_id = 'academic-files');
CREATE POLICY "Authenticated users can upload academic files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'academic-files' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own academic files" ON storage.objects FOR UPDATE USING (bucket_id = 'academic-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own academic files" ON storage.objects FOR DELETE USING (bucket_id = 'academic-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for messages (from messaging-schema)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_members;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.academic_posts TO anon, authenticated;
GRANT ALL ON public.rideshare_posts TO anon, authenticated;
GRANT ALL ON public.exchange_posts TO anon, authenticated;
GRANT ALL ON public.favor_posts TO anon, authenticated;
GRANT ALL ON public.conversations TO anon, authenticated;
GRANT ALL ON public.conversation_members TO anon, authenticated;
GRANT ALL ON public.messages TO anon, authenticated;
GRANT ALL ON public.transactions TO anon, authenticated;
GRANT ALL ON public.ratings TO anon, authenticated;
GRANT ALL ON public.notifications TO anon, authenticated;
GRANT ALL ON public.reports TO anon, authenticated;

-- Insert sample data (consolidated from various schemas)
INSERT INTO user_profiles (user_id, username, full_name, email, university, major, bio, avatar_url) VALUES
(uuid_generate_v4(), 'sarah_chen', 'Sarah Chen', 'sarah.chen@ucla.edu', 'UCLA', 'Computer Science', 'CS major, love helping others with coding!', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'),
(uuid_generate_v4(), 'marcus_johnson', 'Marcus Johnson', 'marcus.j@ucla.edu', 'UCLA', 'Business Economics', 'Business student passionate about entrepreneurship', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'),
(uuid_generate_v4(), 'alex_kim', 'Alex Kim', 'alex.kim@ucla.edu', 'UCLA', 'Computer Science', 'Senior CS student, TA for multiple courses', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'),
(uuid_generate_v4(), 'emma_rodriguez', 'Emma Rodriguez', 'emma.r@ucla.edu', 'UCLA', 'Mathematics', 'Math tutor and study group organizer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'),
(uuid_generate_v4(), 'david_park', 'David Park', 'david.park@ucla.edu', 'UCLA', 'Economics', 'Econ major, finance enthusiast', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face')
ON CONFLICT (username) DO NOTHING;

-- Insert sample academic posts (from supabase-schema)
INSERT INTO academic_posts (department, course, title, resource, pdf_url, uploaded_by, upload_date, popularity, file_type, file_size) VALUES
('Computer Science (CS)', 'CS 31', 'Introduction to Computer Science I', 'Midterm Practice Questions', 'https://web.cs.ucla.edu/classes/fall23/cs31/Exams/midterm_practice.pdf', 'Sarah Chen', '2 days ago', 95, 'application/pdf', 1024000),
('Political Science (Pol Sci)', 'Pol Sci 10', 'Introduction to Political Theory', 'Final Exam Study Guide', 'https://www.polisci.ucla.edu/sites/default/files/study_guide_final.pdf', 'Marcus Johnson', '1 week ago', 87, 'application/pdf', 2048000),
('Computer Science (CS)', 'CS 111', 'Operating Systems Principles', 'Project 2 Solution Guide', 'https://web.cs.ucla.edu/classes/fall23/cs111/projects/project2_solution.pdf', 'Alex Kim', '3 days ago', 92, 'application/pdf', 1536000),
('Mathematics (Math)', 'Math 31A', 'Differential and Integral Calculus', 'Chapter 5 Practice Problems', 'https://www.math.ucla.edu/~tao/resource/general/math31a/practice_ch5.pdf', 'Emma Rodriguez', '5 days ago', 78, 'application/pdf', 768000)
ON CONFLICT DO NOTHING;

-- Insert sample rideshare posts (from supabase-schema-update)
INSERT INTO rideshare_posts (title, destination, reason, date, time, datetime, max_participants, participants, organizer, match_strength, distance) VALUES
('SZA Concert', 'SoFi Stadium', 'Going to see SZA live! Split the Uber cost.', '2024-06-26', '18:00', '2024-06-26T18:00:00Z', 4, 2, 'Maya P.', 95, '0.2 miles away'),
('LAX Airport', 'Terminal 1', 'Early morning flight, need to share ride costs.', '2024-06-27', '08:00', '2024-06-27T08:00:00Z', 3, 1, 'David L.', 87, '0.5 miles away'),
('UCLA Basketball Game', 'Pauley Pavilion', 'Go Bruins! Let''s carpool to the game.', '2024-06-28', '19:30', '2024-06-28T19:30:00Z', 4, 3, 'Jessica M.', 92, '1.2 miles away')
ON CONFLICT DO NOTHING;

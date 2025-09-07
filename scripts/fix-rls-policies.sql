-- Disable RLS on all tables to fix permission issues
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE rideshare_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view all exchange posts" ON exchange_posts;
DROP POLICY IF EXISTS "Users can create exchange posts" ON exchange_posts;
DROP POLICY IF EXISTS "Users can update own exchange posts" ON exchange_posts;

-- Grant necessary permissions
GRANT ALL ON user_profiles TO anon, authenticated;
GRANT ALL ON exchange_posts TO anon, authenticated;
GRANT ALL ON rideshare_posts TO anon, authenticated;
GRANT ALL ON academic_posts TO anon, authenticated;
GRANT ALL ON conversations TO anon, authenticated;
GRANT ALL ON messages TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

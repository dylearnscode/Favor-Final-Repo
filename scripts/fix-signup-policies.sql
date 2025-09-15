-- Fix the database trigger to include full_name
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, username, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate inserts
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy to allow users to insert their own profiles during signup
DROP POLICY IF EXISTS "Users can insert their profile" ON user_profiles;
CREATE POLICY "Users can insert their profile" ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Also allow anonymous users to insert profiles during signup (needed for the signup flow)
DROP POLICY IF EXISTS "Anonymous users can insert profiles during signup" ON user_profiles;
CREATE POLICY "Anonymous users can insert profiles during signup" ON user_profiles
FOR INSERT
WITH CHECK (true); -- This allows the manual profile creation during signup

-- Update the trigger to be more robust
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

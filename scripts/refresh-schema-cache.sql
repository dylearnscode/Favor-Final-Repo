-- Force refresh Supabase schema cache by recreating the foreign key relationship
-- Drop and recreate the foreign key constraint to force schema cache refresh
ALTER TABLE exchange_posts DROP CONSTRAINT IF EXISTS exchange_posts_user_id_fkey;

-- Recreate the foreign key constraint
ALTER TABLE exchange_posts 
ADD CONSTRAINT exchange_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Refresh schema cache by analyzing tables
ANALYZE exchange_posts;
ANALYZE user_profiles;

-- Verify the relationship exists
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='exchange_posts';

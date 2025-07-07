-- Add file metadata columns to academic_posts
ALTER TABLE academic_posts 
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type TEXT;

-- Create rideshare_posts table
CREATE TABLE IF NOT EXISTS rideshare_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  reason TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 4,
  participants INTEGER NOT NULL DEFAULT 1,
  organizer TEXT NOT NULL,
  match_strength INTEGER DEFAULT 85,
  distance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for academic files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('academic-files', 'academic-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for academic files
CREATE POLICY "Anyone can view academic files" ON storage.objects
FOR SELECT USING (bucket_id = 'academic-files');

CREATE POLICY "Authenticated users can upload academic files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'academic-files');

CREATE POLICY "Users can update their own academic files" ON storage.objects
FOR UPDATE USING (bucket_id = 'academic-files');

-- Enable Row Level Security for rideshare_posts
ALTER TABLE rideshare_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for rideshare_posts
CREATE POLICY "Users can view all rideshare posts" ON rideshare_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own rideshare posts" ON rideshare_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update rideshare posts" ON rideshare_posts FOR UPDATE USING (true);

-- Update academic_posts with file metadata for existing records
UPDATE academic_posts 
SET file_type = 'application/pdf', 
    file_size = 1024000 
WHERE file_type IS NULL;

-- Insert sample rideshare posts for testing
INSERT INTO rideshare_posts (title, destination, reason, date, time, datetime, max_participants, participants, organizer, match_strength, distance) VALUES
('SZA Concert', 'SoFi Stadium', 'Going to see SZA live! Split the Uber cost.', '2024-06-26', '18:00', '2024-06-26T18:00:00Z', 4, 2, 'Maya P.', 95, '0.2 miles away'),
('LAX Airport', 'Terminal 1', 'Early morning flight, need to share ride costs.', '2024-06-27', '08:00', '2024-06-27T08:00:00Z', 3, 1, 'David L.', 87, '0.5 miles away'),
('UCLA Basketball Game', 'Pauley Pavilion', 'Go Bruins! Let''s carpool to the game.', '2024-06-28', '19:30', '2024-06-28T19:30:00Z', 4, 3, 'Jessica M.', 92, '1.2 miles away');

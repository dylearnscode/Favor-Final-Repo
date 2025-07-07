-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create academic_posts table
CREATE TABLE IF NOT EXISTS academic_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department TEXT NOT NULL,
  course TEXT NOT NULL,
  title TEXT NOT NULL,
  resource TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  upload_date TEXT DEFAULT 'Just now',
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample academic posts
INSERT INTO academic_posts (department, course, title, resource, pdf_url, uploaded_by, upload_date, popularity) VALUES
('Computer Science (CS)', 'CS 31', 'Introduction to Computer Science I', 'Midterm Practice Questions', 'https://web.cs.ucla.edu/classes/fall23/cs31/Exams/midterm_practice.pdf', 'Sarah Chen', '2 days ago', 95),
('Political Science (Pol Sci)', 'Pol Sci 10', 'Introduction to Political Theory', 'Final Exam Study Guide', 'https://www.polisci.ucla.edu/sites/default/files/study_guide_final.pdf', 'Marcus Johnson', '1 week ago', 87),
('Computer Science (CS)', 'CS 111', 'Operating Systems Principles', 'Project 2 Solution Guide', 'https://web.cs.ucla.edu/classes/fall23/cs111/projects/project2_solution.pdf', 'Alex Kim', '3 days ago', 92),
('Mathematics (Math)', 'Math 31A', 'Differential and Integral Calculus', 'Chapter 5 Practice Problems', 'https://www.math.ucla.edu/~tao/resource/general/math31a/practice_ch5.pdf', 'Emma Rodriguez', '5 days ago', 78);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all academic posts" ON academic_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own academic posts" ON academic_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own academic posts" ON academic_posts FOR UPDATE USING (true);

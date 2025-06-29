-- Create the signups table for storing webinar registrations
CREATE TABLE IF NOT EXISTS signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security (RLS)
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anonymous users to insert signups
CREATE POLICY "Allow anonymous signups" ON signups
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Create a policy to allow authenticated users to view all signups (optional)
CREATE POLICY "Allow authenticated users to view signups" ON signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Add an index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Add an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at DESC); 
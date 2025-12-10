-- scripts/004_create_bookings.sql

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  room_preference TEXT, -- "single", "shared", "any"
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  move_in_date DATE,
  duration_months INTEGER, -- Planned duration
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public to insert bookings
CREATE POLICY "Allow public to create bookings" ON bookings 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Allow public to read their own bookings (optional, for future feature)
CREATE POLICY "Allow public to read bookings" ON bookings 
  FOR SELECT TO anon, authenticated 
  USING (true);

-- Allow authenticated users (admin) full access
CREATE POLICY "Allow authenticated users to manage bookings" ON bookings 
  FOR ALL TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_move_in_date ON bookings(move_in_date);

-- Add proof_url column to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS proof_url TEXT;

-- Add notification_sent column to payments for tracking verification notifications
ALTER TABLE payments ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

-- Create storage bucket for payment proofs (run via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Update RLS policies to allow public read access for rooms and tenants
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated users full access to rooms" ON rooms;
DROP POLICY IF EXISTS "Allow authenticated users full access to tenants" ON tenants;
DROP POLICY IF EXISTS "Allow authenticated users full access to payments" ON payments;
DROP POLICY IF EXISTS "Allow authenticated users full access to reminders" ON reminders;

-- Rooms: Public can read, only authenticated can modify
CREATE POLICY "Allow public read access to rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify rooms" ON rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tenants: Public can read, only authenticated can modify
CREATE POLICY "Allow public read access to tenants" ON tenants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated users to modify tenants" ON tenants FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Payments: Public can read and insert (for uploading proof), authenticated can do all
CREATE POLICY "Allow public read access to payments" ON payments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public to insert payments" ON payments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to modify payments" ON payments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete payments" ON payments FOR DELETE TO authenticated USING (true);

-- Reminders: Only authenticated users
CREATE POLICY "Allow authenticated users full access to reminders" ON reminders FOR ALL TO authenticated USING (true) WITH CHECK (true);

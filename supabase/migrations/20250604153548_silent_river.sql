/*
  # Create events table and relationships

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `location` (text)
      - `image` (text)
      - `organizer_id` (uuid, references profiles)
      - `capacity` (integer)
      - `registered_count` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `events` table
    - Add policies for:
      - Public read access
      - Organizer create/update access
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  image text NOT NULL,
  organizer_id uuid NOT NULL REFERENCES profiles(id),
  capacity integer NOT NULL CHECK (capacity > 0),
  registered_count integer NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
  status text NOT NULL CHECK (status IN ('upcoming', 'present', 'past')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Everyone can read events
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Only organizers can create events
CREATE POLICY "Organizers can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'organizer'
    )
  );

-- Organizers can update their own events
CREATE POLICY "Organizers can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Create registrations table and update events

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `registrations` table
    - Add policies for:
      - Users can read registrations for events they're registered to
      - Users can create registrations for events
      - Event organizers can view all registrations for their events
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Users can read their own registrations
CREATE POLICY "Users can read own registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Event organizers can read registrations for their events
CREATE POLICY "Organizers can read event registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = registrations.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Users can create registrations
CREATE POLICY "Users can create registrations"
  ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update event registration count
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET registered_count = registered_count + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET registered_count = registered_count - 1
    WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to maintain registration count
CREATE TRIGGER after_registration_insert
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registration_count();

CREATE TRIGGER after_registration_delete
  AFTER DELETE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_registration_count();
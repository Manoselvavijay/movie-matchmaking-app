-- Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  liked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, user_id, movie_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(room_id, movie_id)
);

-- Enable RLS
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies for swipes
CREATE POLICY "Users can insert their own swipes" ON swipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view swipes in their room" ON swipes FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = swipes.room_id AND (host_user_id = auth.uid() OR player2_user_id = auth.uid()))
);

-- Policies for matches
CREATE POLICY "Users can view matches in their room" ON matches FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = matches.room_id AND (host_user_id = auth.uid() OR player2_user_id = auth.uid()))
);

-- Function to handle new swipes and detect matches
CREATE OR REPLACE FUNCTION handle_new_swipe() RETURNS TRIGGER AS $$
BEGIN
  -- Only check for match if the new swipe is a "LIKE"
  IF NEW.liked = true THEN
    -- Check if another user in the same room has already liked this movie
    IF EXISTS (
      SELECT 1 FROM swipes 
      WHERE room_id = NEW.room_id 
      AND movie_id = NEW.movie_id 
      AND liked = true 
      AND user_id != NEW.user_id
    ) THEN
      -- It's a match! Insert into matches table if not exists
      INSERT INTO matches (room_id, movie_id)
      VALUES (NEW.room_id, NEW.movie_id)
      ON CONFLICT (room_id, movie_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_swipe_match ON swipes;
CREATE TRIGGER on_swipe_match
AFTER INSERT ON swipes
FOR EACH ROW
EXECUTE FUNCTION handle_new_swipe();

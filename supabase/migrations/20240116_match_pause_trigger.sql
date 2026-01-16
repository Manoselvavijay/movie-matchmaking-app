-- Trigger function to automatically pause the game when a match is detected
CREATE OR REPLACE FUNCTION pause_game_on_match() RETURNS TRIGGER AS $$
BEGIN
  -- Update the room status to 'paused' when a new match is inserted
  UPDATE rooms 
  SET status = 'paused' 
  WHERE id = NEW.room_id 
  AND status = 'playing';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_match_pause_game ON matches;
CREATE TRIGGER on_match_pause_game
AFTER INSERT ON matches
FOR EACH ROW
EXECUTE FUNCTION pause_game_on_match();

-- Allow users to update rooms they participate in (HOST or PLAYER 2)
CREATE POLICY "Users can update their rooms" ON rooms
FOR UPDATE TO authenticated
USING (
  auth.uid() = host_user_id OR auth.uid() = player2_user_id
);

-- Ensure RLS is enabled
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

import GameModeSelection from "@/components/GameModeSelection";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch user session
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Error fetching user session:', error);
  }

  return (
    <GameModeSelection user={user} />
  );
}

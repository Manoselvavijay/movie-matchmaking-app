/**
 * Enable Realtime for Swipes, Matches, and Rooms
 */
begin;

-- Ensure the publication exists (idempotent)
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end;
$$;

-- Add tables to the publication
alter publication supabase_realtime add table swipes, matches, rooms;

commit;

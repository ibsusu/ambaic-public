REVOKE ALL PRIVILEGES ON spins FROM public, anon, authenticated;
GRANT SELECT (reel1, reel2, reel3, ac, created_at, updatable_at, bank, user_id) on spins to public, anon, authenticated;
-- GRANT UPDATE (reel1, reel2, reel3, ac, created_at, updatable_at, user_id, bank, id) on spins to public, anon, authenticated;
REVOKE ALL PRIVILEGES ON bank FROM public, anon, authenticated;
GRANT SELECT (gold, affection, conquests, shields, followers, conversions, rescues, sessions, spins, user_id) on bank to public, anon, authenticated;
-- GRANT UPDATE (gold, affection, conquests, shields, followers, conversions, rescues, sessions, spins) on bank to public, anon, authenticated;
-- revoke select (id) on spins from anon;
-- revoke select (id) on spins from authenticated;
-- grant select (id) on spins to service_role;
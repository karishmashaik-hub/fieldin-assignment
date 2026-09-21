-- FieldIn seed data.
-- Run after schema.sql. Safe to re-run against a fresh database only
-- (uses fixed UUIDs so re-running against an already-seeded DB will conflict on PKs).
--
-- Demo login for every seeded user: password "Password123!"

-- ===== Users =====
-- aditya: healthy coin balance (demos successful voucher redemption)
-- meera: low balance (demos the insufficient-coins error path)
-- rahul: mid balance, used as a squad captain in later matchmaking seed data
INSERT INTO users (id, name, email, password_hash, coins_balance, trust_score, punctuality_rate, sport_preferences)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Aditya Rao', 'aditya@fieldin.dev', '$2b$10$DxrOMJwmbYBPvqSfrxokoee/hSUC1ZlvSirR7163MGN93rXhfKIRW', 150, 4.8, 96.00, ARRAY['Football', 'Cricket']),
  ('22222222-2222-2222-2222-222222222222', 'Meera Nair', 'meera@fieldin.dev', '$2b$10$DxrOMJwmbYBPvqSfrxokoee/hSUC1ZlvSirR7163MGN93rXhfKIRW', 10, 4.2, 88.00, ARRAY['Badminton']),
  ('33333333-3333-3333-3333-333333333333', 'Rahul Verma', 'rahul@fieldin.dev', '$2b$10$DxrOMJwmbYBPvqSfrxokoee/hSUC1ZlvSirR7163MGN93rXhfKIRW', 60, 4.5, 92.00, ARRAY['Cricket', 'Tennis']);

-- ===== Venues =====
-- Reference "current location" used by the frontend's default demo location pill: (12.9352, 77.6146)
-- Venues 1-4 fall within ~5km of that point; 5-8 fall outside it, to exercise the PostGIS distance filter.
INSERT INTO venues (id, name, sport_type, address, lat, lng, geo, hourly_rate, capacity, crowd_occupancy, weather_condition, has_live_cam)
VALUES
  ('a1111111-0000-0000-0000-000000000001', 'Koramangala Football Turf', 'Football', 'Koramangala 5th Block, Bengaluru', 12.9352, 77.6146, ST_SetSRID(ST_MakePoint(77.6146, 12.9352), 4326)::geography, 800.00, 14, 45, 'Clear', true),
  ('a1111111-0000-0000-0000-000000000002', 'Jayanagar Cricket Ground', 'Cricket', 'Jayanagar 4th Block, Bengaluru', 12.9250, 77.5938, ST_SetSRID(ST_MakePoint(77.5938, 12.9250), 4326)::geography, 1200.00, 22, 70, 'Cloudy', false),
  ('a1111111-0000-0000-0000-000000000003', 'HSR Badminton Court', 'Badminton', 'HSR Layout Sector 2, Bengaluru', 12.9121, 77.6446, ST_SetSRID(ST_MakePoint(77.6446, 12.9121), 4326)::geography, 500.00, 8, 20, 'Clear', true),
  ('a1111111-0000-0000-0000-000000000004', 'BTM Basketball Arena', 'Basketball', 'BTM Layout 2nd Stage, Bengaluru', 12.9166, 77.6101, ST_SetSRID(ST_MakePoint(77.6101, 12.9166), 4326)::geography, 600.00, 10, 90, 'Rainy', false),
  ('a1111111-0000-0000-0000-000000000005', 'Indiranagar Tennis Club', 'Tennis', '100 Feet Road, Indiranagar, Bengaluru', 12.9784, 77.6408, ST_SetSRID(ST_MakePoint(77.6408, 12.9784), 4326)::geography, 1500.00, 4, 55, 'Clear', true),
  ('a1111111-0000-0000-0000-000000000006', 'Whitefield Football Turf', 'Football', 'ITPL Main Road, Whitefield, Bengaluru', 12.9698, 77.7500, ST_SetSRID(ST_MakePoint(77.7500, 12.9698), 4326)::geography, 900.00, 14, 30, 'Cloudy', false),
  ('a1111111-0000-0000-0000-000000000007', 'Electronic City Tennis Arena', 'Tennis', 'Electronic City Phase 1, Bengaluru', 12.8452, 77.6602, ST_SetSRID(ST_MakePoint(77.6602, 12.8452), 4326)::geography, 1100.00, 4, 65, 'Clear', true),
  ('a1111111-0000-0000-0000-000000000008', 'Marathahalli Cricket Nets', 'Cricket', 'Outer Ring Road, Marathahalli, Bengaluru', 12.9569, 77.7011, ST_SetSRID(ST_MakePoint(77.7011, 12.9569), 4326)::geography, 700.00, 16, 15, 'Rainy', false);

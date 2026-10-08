-- ==============================================================================
-- RailTicket Complete Supabase Database Schema
-- Includes:
--   1. STATIONS Table + Seed Data
--   2. TRAINS Table + Real Train Details (Classes, Stops, Fares, Schedules)
--   3. BOOKINGS Table + Passenger Details
--   4. Row Level Security (RLS) & API Grants
--
-- How to apply:
--   Go to Supabase Dashboard -> SQL Editor -> New Query -> Paste & click "RUN"
-- ==============================================================================

-- ==============================================================================
-- 1. STATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stations (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    platforms INT DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 2. TRAINS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.trains (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    origin_code TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    origin_city TEXT NOT NULL,
    destination_code TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    runs_on_days INT[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
    total_distance_km INT NOT NULL DEFAULT 500,
    pantry_available BOOLEAN DEFAULT true,
    cleanliness_rating NUMERIC(3, 1) DEFAULT 4.8,
    classes JSONB NOT NULL DEFAULT '{}'::jsonb,
    stops JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning-fast train searches
CREATE INDEX IF NOT EXISTS idx_trains_number ON public.trains (number);
CREATE INDEX IF NOT EXISTS idx_trains_route ON public.trains (origin_code, destination_code);

-- ==============================================================================
-- 3. BOOKINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    pnr TEXT NOT NULL UNIQUE,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    train_type TEXT,
    origin_code TEXT NOT NULL,
    origin_name TEXT,
    destination_code TEXT NOT NULL,
    destination_name TEXT,
    journey_date TEXT NOT NULL,
    departure_time TEXT,
    arrival_time TEXT,
    duration TEXT,
    class_code TEXT NOT NULL,
    class_name TEXT,
    quota TEXT DEFAULT 'General Quota',
    passengers JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    base_fare NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reservation_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    insurance_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_fare NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMPTZ DEFAULT now(),
    cancelled_at TIMESTAMPTZ,
    refund_amount NUMERIC(12, 2) DEFAULT 0,
    platform_number INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings (pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings (contact_email);
CREATE INDEX IF NOT EXISTS idx_bookings_journey_date ON public.bookings (journey_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Stations Policies
DROP POLICY IF EXISTS "Allow public read access on stations" ON public.stations;
CREATE POLICY "Allow public read access on stations"
    ON public.stations FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on stations" ON public.stations;
CREATE POLICY "Allow public insert on stations"
    ON public.stations FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Trains Policies
DROP POLICY IF EXISTS "Allow public read access on trains" ON public.trains;
CREATE POLICY "Allow public read access on trains"
    ON public.trains FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on trains" ON public.trains;
CREATE POLICY "Allow public insert on trains"
    ON public.trains FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Bookings Policies (Read, Insert, and Update)
DROP POLICY IF EXISTS "Allow public read access on bookings" ON public.bookings;
CREATE POLICY "Allow public read access on bookings"
    ON public.bookings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert access on bookings" ON public.bookings;
CREATE POLICY "Allow public insert access on bookings"
    ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on bookings" ON public.bookings;
CREATE POLICY "Allow public update access on bookings"
    ON public.bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Expose Schema and Tables to PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.stations TO anon, authenticated;
GRANT ALL ON TABLE public.trains TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;

-- ==============================================================================
-- 5. SEED DATA: MAJOR RAILWAY STATIONS
-- ==============================================================================
INSERT INTO public.stations (code, name, city, state, platforms) VALUES
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi', 16),
('MMCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 12),
('SBC', 'KSR Bengaluru City', 'Bengaluru', 'Karnataka', 10),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 12),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 23),
('BSB', 'Varanasi Junction', 'Varanasi', 'Uttar Pradesh', 9),
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 8),
('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 12),
('PUNE', 'Pune Junction', 'Pune', 'Maharashtra', 6),
('HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana', 6),
('AGC', 'Agra Cantt', 'Agra', 'Uttar Pradesh', 6),
('CNB', 'Kanpur Central', 'Kanpur', 'Uttar Pradesh', 10),
('LKO', 'Lucknow Charbagh', 'Lucknow', 'Uttar Pradesh', 9),
('BKN', 'Bikaner Junction', 'Bikaner', 'Rajasthan', 5),
('ASR', 'Amritsar Junction', 'Amritsar', 'Punjab', 8),
('CDG', 'Chandigarh Junction', 'Chandigarh', 'Punjab / Haryana', 6),
('GKP', 'Gorakhpur Junction', 'Gorakhpur', 'Uttar Pradesh', 10),
('BPL', 'Bhopal Junction', 'Bhopal', 'Madhya Pradesh', 6)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    platforms = EXCLUDED.platforms;

-- ==============================================================================
-- 6. SEED DATA: TRAIN DETAILS (VANDE BHARAT, RAJDHANI, SHATABDI, EXPRESS)
-- ==============================================================================

-- Train 1: Vande Bharat Express (New Delhi to Varanasi)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-22436', '22436', 'Vande Bharat Express', 'Vande Bharat',
    'NDLS', 'New Delhi Railway Station', 'New Delhi',
    'BSB', 'Varanasi Junction', 'Varanasi',
    '06:00', '14:00', '8h 00m', '{0, 2, 3, 5, 6}', 759,
    true, 4.9,
    '{
        "EC": {"status": "AVAILABLE", "seatsAvailable": 28, "basePrice": 2845, "coachCode": "E1"},
        "CC": {"status": "AVAILABLE", "seatsAvailable": 94, "basePrice": 1475, "coachCode": "C3"}
    }'::jsonb,
    '[
        {"stationCode": "NDLS", "stationName": "New Delhi", "arrivalTime": "Start", "departureTime": "06:00", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 16},
        {"stationCode": "CNB", "stationName": "Kanpur Central", "arrivalTime": "10:08", "departureTime": "10:10", "haltMinutes": 2, "distanceKm": 440, "day": 1, "platform": 5},
        {"stationCode": "PRYJ", "stationName": "Prayagraj Junction", "arrivalTime": "12:08", "departureTime": "12:10", "haltMinutes": 2, "distanceKm": 635, "day": 1, "platform": 6},
        {"stationCode": "BSB", "stationName": "Varanasi Junction", "arrivalTime": "14:00", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 759, "day": 1, "platform": 1}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 2: Mumbai Rajdhani Express (New Delhi to Mumbai Central)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-12952', '12952', 'Mumbai Rajdhani Express', 'Rajdhani Express',
    'NDLS', 'New Delhi Railway Station', 'New Delhi',
    'MMCT', 'Mumbai Central', 'Mumbai',
    '16:55', '08:35', '15h 40m', '{0, 1, 2, 3, 4, 5, 6}', 1386,
    true, 4.8,
    '{
        "1A": {"status": "AVAILABLE", "seatsAvailable": 6, "basePrice": 4780, "coachCode": "H1"},
        "2A": {"status": "AVAILABLE", "seatsAvailable": 34, "basePrice": 2890, "coachCode": "A2"},
        "3A": {"status": "AVAILABLE", "seatsAvailable": 78, "basePrice": 2110, "coachCode": "B4"}
    }'::jsonb,
    '[
        {"stationCode": "NDLS", "stationName": "New Delhi", "arrivalTime": "Start", "departureTime": "16:55", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 3},
        {"stationCode": "KOTA", "stationName": "Kota Junction", "arrivalTime": "21:30", "departureTime": "21:40", "haltMinutes": 10, "distanceKm": 466, "day": 1, "platform": 1},
        {"stationCode": "RTM", "stationName": "Ratlam Junction", "arrivalTime": "00:35", "departureTime": "00:38", "haltMinutes": 3, "distanceKm": 732, "day": 2, "platform": 4},
        {"stationCode": "BRC", "stationName": "Vadodara Junction", "arrivalTime": "03:55", "departureTime": "04:05", "haltMinutes": 10, "distanceKm": 993, "day": 2, "platform": 2},
        {"stationCode": "ST", "stationName": "Surat", "arrivalTime": "05:33", "departureTime": "05:38", "haltMinutes": 5, "distanceKm": 1122, "day": 2, "platform": 1},
        {"stationCode": "MMCT", "stationName": "Mumbai Central", "arrivalTime": "08:35", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 1386, "day": 2, "platform": 1}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 3: Tejas Rajdhani Express (Mumbai to New Delhi)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-12951', '12951', 'Tejas Rajdhani Express', 'Rajdhani Express',
    'MMCT', 'Mumbai Central', 'Mumbai',
    'NDLS', 'New Delhi Railway Station', 'New Delhi',
    '17:00', '08:32', '15h 32m', '{0, 1, 2, 3, 4, 5, 6}', 1386,
    true, 4.9,
    '{
        "1A": {"status": "AVAILABLE", "seatsAvailable": 8, "basePrice": 4850, "coachCode": "H1"},
        "2A": {"status": "AVAILABLE", "seatsAvailable": 42, "basePrice": 2950, "coachCode": "A1"},
        "3A": {"status": "AVAILABLE", "seatsAvailable": 112, "basePrice": 2150, "coachCode": "B2"}
    }'::jsonb,
    '[
        {"stationCode": "MMCT", "stationName": "Mumbai Central", "arrivalTime": "Start", "departureTime": "17:00", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 2},
        {"stationCode": "ST", "stationName": "Surat", "arrivalTime": "19:43", "departureTime": "19:48", "haltMinutes": 5, "distanceKm": 263, "day": 1, "platform": 1},
        {"stationCode": "BRC", "stationName": "Vadodara Junction", "arrivalTime": "21:06", "departureTime": "21:16", "haltMinutes": 10, "distanceKm": 393, "day": 1, "platform": 3},
        {"stationCode": "KOTA", "stationName": "Kota Junction", "arrivalTime": "03:15", "departureTime": "03:25", "haltMinutes": 10, "distanceKm": 920, "day": 2, "platform": 1},
        {"stationCode": "NDLS", "stationName": "New Delhi", "arrivalTime": "08:32", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 1386, "day": 2, "platform": 4}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 4: Mysuru - Chennai Vande Bharat Express (Bengaluru to Chennai)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-20608', '20608', 'Mysuru - Chennai Vande Bharat', 'Vande Bharat',
    'SBC', 'KSR Bengaluru City', 'Bengaluru',
    'MAS', 'Chennai Central', 'Chennai',
    '14:50', '19:20', '4h 30m', '{0, 1, 2, 4, 5, 6}', 359,
    true, 4.9,
    '{
        "EC": {"status": "AVAILABLE", "seatsAvailable": 31, "basePrice": 1980, "coachCode": "E1"},
        "CC": {"status": "AVAILABLE", "seatsAvailable": 140, "basePrice": 995, "coachCode": "C4"}
    }'::jsonb,
    '[
        {"stationCode": "SBC", "stationName": "KSR Bengaluru", "arrivalTime": "Start", "departureTime": "14:50", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 7},
        {"stationCode": "KJM", "stationName": "Krishnarajapuram", "arrivalTime": "15:10", "departureTime": "15:12", "haltMinutes": 2, "distanceKm": 14, "day": 1, "platform": 2},
        {"stationCode": "KPD", "stationName": "Katpadi Junction", "arrivalTime": "17:33", "departureTime": "17:35", "haltMinutes": 2, "distanceKm": 229, "day": 1, "platform": 1},
        {"stationCode": "MAS", "stationName": "Chennai Central", "arrivalTime": "19:20", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 359, "day": 1, "platform": 2}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 5: Charminar SF Express (Hyderabad to Chennai)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-12760', '12760', 'Charminar SF Express', 'Superfast Express',
    'HYB', 'Hyderabad Deccan', 'Hyderabad',
    'MAS', 'Chennai Central', 'Chennai',
    '18:00', '08:00', '14h 00m', '{0, 1, 2, 3, 4, 5, 6}', 790,
    true, 4.6,
    '{
        "1A": {"status": "AVAILABLE", "seatsAvailable": 10, "basePrice": 3120, "coachCode": "H1"},
        "2A": {"status": "AVAILABLE", "seatsAvailable": 38, "basePrice": 1890, "coachCode": "A2"},
        "3A": {"status": "AVAILABLE", "seatsAvailable": 92, "basePrice": 1340, "coachCode": "B3"},
        "SL": {"status": "AVAILABLE", "seatsAvailable": 160, "basePrice": 490, "coachCode": "S2"}
    }'::jsonb,
    '[
        {"stationCode": "HYB", "stationName": "Hyderabad Deccan", "arrivalTime": "Start", "departureTime": "18:00", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 5},
        {"stationCode": "SC", "stationName": "Secunderabad", "arrivalTime": "18:20", "departureTime": "18:25", "haltMinutes": 5, "distanceKm": 9, "day": 1, "platform": 1},
        {"stationCode": "KZJ", "stationName": "Kazipet Junction", "arrivalTime": "20:18", "departureTime": "20:20", "haltMinutes": 2, "distanceKm": 141, "day": 1, "platform": 2},
        {"stationCode": "BZA", "stationName": "Vijayawada", "arrivalTime": "00:05", "departureTime": "00:15", "haltMinutes": 10, "distanceKm": 358, "day": 2, "platform": 6},
        {"stationCode": "GDR", "stationName": "Gudur Junction", "arrivalTime": "05:18", "departureTime": "05:20", "haltMinutes": 2, "distanceKm": 650, "day": 2, "platform": 1},
        {"stationCode": "MAS", "stationName": "Chennai Central", "arrivalTime": "08:00", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 790, "day": 2, "platform": 4}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 6: Howrah Rajdhani Express (Howrah to New Delhi)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-12301', '12301', 'Howrah Rajdhani Express', 'Rajdhani Express',
    'HWH', 'Howrah Junction', 'Kolkata',
    'NDLS', 'New Delhi Railway Station', 'New Delhi',
    '16:50', '10:05', '17h 15m', '{1, 2, 3, 4, 5, 6}', 1451,
    true, 4.7,
    '{
        "1A": {"status": "AVAILABLE", "seatsAvailable": 4, "basePrice": 4950, "coachCode": "H1"},
        "2A": {"status": "AVAILABLE", "seatsAvailable": 26, "basePrice": 3050, "coachCode": "A2"},
        "3A": {"status": "AVAILABLE", "seatsAvailable": 58, "basePrice": 2220, "coachCode": "B1"}
    }'::jsonb,
    '[
        {"stationCode": "HWH", "stationName": "Howrah Junction", "arrivalTime": "Start", "departureTime": "16:50", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 9},
        {"stationCode": "ASN", "stationName": "Asansol Junction", "arrivalTime": "18:57", "departureTime": "19:00", "haltMinutes": 3, "distanceKm": 200, "day": 1, "platform": 4},
        {"stationCode": "DHN", "stationName": "Dhanbad Junction", "arrivalTime": "19:50", "departureTime": "19:55", "haltMinutes": 5, "distanceKm": 259, "day": 1, "platform": 3},
        {"stationCode": "DDU", "stationName": "Pt DD Upadhyaya", "arrivalTime": "00:45", "departureTime": "00:55", "haltMinutes": 10, "distanceKm": 664, "day": 2, "platform": 2},
        {"stationCode": "CNB", "stationName": "Kanpur Central", "arrivalTime": "04:50", "departureTime": "04:55", "haltMinutes": 5, "distanceKm": 1012, "day": 2, "platform": 1},
        {"stationCode": "NDLS", "stationName": "New Delhi", "arrivalTime": "10:05", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 1451, "day": 2, "platform": 6}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Train 7: Kerala Superfast Express (New Delhi to Bengaluru)
INSERT INTO public.trains (
    id, number, name, type,
    origin_code, origin_name, origin_city,
    destination_code, destination_name, destination_city,
    departure_time, arrival_time, duration, runs_on_days, total_distance_km,
    pantry_available, cleanliness_rating, classes, stops
) VALUES (
    'tr-12626', '12626', 'Kerala Superfast Express', 'Superfast Express',
    'NDLS', 'New Delhi Railway Station', 'New Delhi',
    'SBC', 'KSR Bengaluru City', 'Bengaluru',
    '20:10', '06:45', '34h 35m', '{0, 1, 2, 3, 4, 5, 6}', 2380,
    true, 4.5,
    '{
        "2A": {"status": "AVAILABLE", "seatsAvailable": 19, "basePrice": 3420, "coachCode": "A1"},
        "3A": {"status": "AVAILABLE", "seatsAvailable": 62, "basePrice": 2360, "coachCode": "B3"},
        "SL": {"status": "AVAILABLE", "seatsAvailable": 140, "basePrice": 890, "coachCode": "S5"}
    }'::jsonb,
    '[
        {"stationCode": "NDLS", "stationName": "New Delhi", "arrivalTime": "Start", "departureTime": "20:10", "haltMinutes": 0, "distanceKm": 0, "day": 1, "platform": 5},
        {"stationCode": "AGC", "stationName": "Agra Cantt", "arrivalTime": "22:20", "departureTime": "22:25", "haltMinutes": 5, "distanceKm": 195, "day": 1, "platform": 3},
        {"stationCode": "BPL", "stationName": "Bhopal Junction", "arrivalTime": "05:20", "departureTime": "05:30", "haltMinutes": 10, "distanceKm": 708, "day": 2, "platform": 1},
        {"stationCode": "NGP", "stationName": "Nagpur Junction", "arrivalTime": "11:45", "departureTime": "11:50", "haltMinutes": 5, "distanceKm": 1098, "day": 2, "platform": 2},
        {"stationCode": "SBC", "stationName": "KSR Bengaluru", "arrivalTime": "06:45", "departureTime": "Ends", "haltMinutes": 0, "distanceKm": 2380, "day": 3, "platform": 4}
    ]'::jsonb
) ON CONFLICT (number) DO UPDATE SET
    name = EXCLUDED.name,
    classes = EXCLUDED.classes,
    stops = EXCLUDED.stops;

-- Notify PostgREST to reload the schema cache so API queries take effect immediately
NOTIFY pgrst, 'reload schema';

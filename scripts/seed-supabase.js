const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env parser without external dependencies
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (e) {}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gevzqlphosoimdfpzmxx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0MP3wyOBRPeALzmkO0QSxg_9nsbulTK';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi', platforms: 16 },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', platforms: 12 },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', platforms: 10 },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', platforms: 12 },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', platforms: 23 },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', platforms: 9 },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', platforms: 8 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', platforms: 12 },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', platforms: 6 },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', platforms: 6 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', platforms: 6 },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', platforms: 10 },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', platforms: 9 },
  { code: 'BKN', name: 'Bikaner Junction', city: 'Bikaner', state: 'Rajasthan', platforms: 5 },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', platforms: 8 },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab / Haryana', platforms: 6 },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', platforms: 10 },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', platforms: 6 },
];

const TRAINS = [
  {
    id: 'tr-22436',
    number: '22436',
    name: 'Vande Bharat Express',
    type: 'Vande Bharat',
    origin_code: 'NDLS',
    origin_name: 'New Delhi Railway Station',
    origin_city: 'New Delhi',
    destination_code: 'BSB',
    destination_name: 'Varanasi Junction',
    destination_city: 'Varanasi',
    departure_time: '06:00',
    arrival_time: '14:00',
    duration: '8h 00m',
    runs_on_days: [0, 2, 3, 5, 6],
    total_distance_km: 759,
    pantry_available: true,
    cleanliness_rating: 4.9,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 28, basePrice: 2845, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 94, basePrice: 1475, coachCode: 'C3' },
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '06:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 16 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:08', departureTime: '10:10', haltMinutes: 2, distanceKm: 440, day: 1, platform: 5 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '12:08', departureTime: '12:10', haltMinutes: 2, distanceKm: 635, day: 1, platform: 6 },
      { stationCode: 'BSB', stationName: 'Varanasi Junction', arrivalTime: '14:00', departureTime: 'Ends', haltMinutes: 0, distanceKm: 759, day: 1, platform: 1 },
    ],
  },
  {
    id: 'tr-12952',
    number: '12952',
    name: 'Mumbai Rajdhani Express',
    type: 'Rajdhani Express',
    origin_code: 'NDLS',
    origin_name: 'New Delhi Railway Station',
    origin_city: 'New Delhi',
    destination_code: 'MMCT',
    destination_name: 'Mumbai Central',
    destination_city: 'Mumbai',
    departure_time: '16:55',
    arrival_time: '08:35',
    duration: '15h 40m',
    runs_on_days: [0, 1, 2, 3, 4, 5, 6],
    total_distance_km: 1386,
    pantry_available: true,
    cleanliness_rating: 4.8,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 6, basePrice: 4780, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 34, basePrice: 2890, coachCode: 'A2' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 78, basePrice: 2110, coachCode: 'B4' },
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '16:55', haltMinutes: 0, distanceKm: 0, day: 1, platform: 3 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '21:30', departureTime: '21:40', haltMinutes: 10, distanceKm: 466, day: 1, platform: 1 },
      { stationCode: 'RTM', stationName: 'Ratlam Junction', arrivalTime: '00:35', departureTime: '00:38', haltMinutes: 3, distanceKm: 732, day: 2, platform: 4 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:55', departureTime: '04:05', haltMinutes: 10, distanceKm: 993, day: 2, platform: 2 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:33', departureTime: '05:38', haltMinutes: 5, distanceKm: 1122, day: 2, platform: 1 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '08:35', departureTime: 'Ends', haltMinutes: 0, distanceKm: 1386, day: 2, platform: 1 },
    ],
  },
  {
    id: 'tr-20608',
    number: '20608',
    name: 'Mysuru - Chennai Vande Bharat',
    type: 'Vande Bharat',
    origin_code: 'SBC',
    origin_name: 'KSR Bengaluru City',
    origin_city: 'Bengaluru',
    destination_code: 'MAS',
    destination_name: 'Chennai Central',
    destination_city: 'Chennai',
    departure_time: '14:50',
    arrival_time: '19:20',
    duration: '4h 30m',
    runs_on_days: [0, 1, 2, 4, 5, 6],
    total_distance_km: 359,
    pantry_available: true,
    cleanliness_rating: 4.9,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 31, basePrice: 1980, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 140, basePrice: 995, coachCode: 'C4' },
    },
    stops: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: 'Start', departureTime: '14:50', haltMinutes: 0, distanceKm: 0, day: 1, platform: 7 },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrivalTime: '15:10', departureTime: '15:12', haltMinutes: 2, distanceKm: 14, day: 1, platform: 2 },
      { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '17:33', departureTime: '17:35', haltMinutes: 2, distanceKm: 229, day: 1, platform: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '19:20', departureTime: 'Ends', haltMinutes: 0, distanceKm: 359, day: 1, platform: 2 },
    ],
  },
  {
    id: 'tr-12760',
    number: '12760',
    name: 'Charminar SF Express',
    type: 'Superfast Express',
    origin_code: 'HYB',
    origin_name: 'Hyderabad Deccan',
    origin_city: 'Hyderabad',
    destination_code: 'MAS',
    destination_name: 'Chennai Central',
    destination_city: 'Chennai',
    departure_time: '18:00',
    arrival_time: '08:00',
    duration: '14h 00m',
    runs_on_days: [0, 1, 2, 3, 4, 5, 6],
    total_distance_km: 790,
    pantry_available: true,
    cleanliness_rating: 4.6,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 10, basePrice: 3120, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 38, basePrice: 1890, coachCode: 'A2' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 92, basePrice: 1340, coachCode: 'B3' },
      SL: { status: 'AVAILABLE', seatsAvailable: 160, basePrice: 490, coachCode: 'S2' },
    },
    stops: [
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: 'Start', departureTime: '18:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 5 },
      { stationCode: 'SC', stationName: 'Secunderabad', arrivalTime: '18:20', departureTime: '18:25', haltMinutes: 5, distanceKm: 9, day: 1, platform: 1 },
      { stationCode: 'KZJ', stationName: 'Kazipet Junction', arrivalTime: '20:18', departureTime: '20:20', haltMinutes: 2, distanceKm: 141, day: 1, platform: 2 },
      { stationCode: 'BZA', stationName: 'Vijayawada', arrivalTime: '00:05', departureTime: '00:15', haltMinutes: 10, distanceKm: 358, day: 2, platform: 6 },
      { stationCode: 'GDR', stationName: 'Gudur Junction', arrivalTime: '05:18', departureTime: '05:20', haltMinutes: 2, distanceKm: 650, day: 2, platform: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '08:00', departureTime: 'Ends', haltMinutes: 0, distanceKm: 790, day: 2, platform: 4 },
    ],
  },
];

async function seed() {
  console.log('--- Seeding Supabase Database ---');
  
  // 1. Seed Stations
  console.log('Seeding stations...');
  const { data: sData, error: sErr } = await supabase
    .from('stations')
    .upsert(STATIONS, { onConflict: 'code' });
  if (sErr) {
    console.error('Notice on stations table:', sErr.message);
  } else {
    console.log(`✓ Successfully seeded ${STATIONS.length} stations!`);
  }

  // 2. Seed Trains
  console.log('Seeding trains...');
  const { data: tData, error: tErr } = await supabase
    .from('trains')
    .upsert(TRAINS, { onConflict: 'number' });
  if (tErr) {
    console.error('Notice on trains table:', tErr.message);
  } else {
    console.log(`✓ Successfully seeded ${TRAINS.length} trains!`);
  }
}

seed().catch(console.error);

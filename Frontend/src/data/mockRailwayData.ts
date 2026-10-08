import { Station, TravelClass, Train, Booking } from '../types/railway';

export const STATIONS: Station[] = [
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

export const TRAVEL_CLASSES: TravelClass[] = [
  { code: '1A', name: 'AC First Class', shortDescription: 'Private 2/4-berth lockable coupes with bedding, dining & attendants', multiplier: 3.5, berthType: 'sleeper' },
  { code: '2A', name: 'AC 2-Tier', shortDescription: 'Spacious air-conditioned 2-tier berths with privacy curtains & reading lamps', multiplier: 2.2, berthType: 'sleeper' },
  { code: '3A', name: 'AC 3-Tier', shortDescription: 'Comfortable air-conditioned 3-tier berths, most popular express choice', multiplier: 1.5, berthType: 'sleeper' },
  { code: 'SL', name: 'Sleeper Class', shortDescription: 'Traditional non-air-conditioned open berths with natural cross breeze', multiplier: 0.8, berthType: 'sleeper' },
  { code: 'EC', name: 'Exec. Chair Car', shortDescription: 'Premium 2x2 spacious recliners with personal charging & complimentary meals', multiplier: 2.8, berthType: 'chair' },
  { code: 'CC', name: 'AC Chair Car', shortDescription: 'Comfortable 3x2 ergonomic seating with tray tables for daytime journeys', multiplier: 1.2, berthType: 'chair' },
];

export const QUOTAS = [
  { id: 'GN', name: 'General Quota', badge: 'Standard' },
  { id: 'TQ', name: 'Tatkal Quota', badge: 'Emergency' },
  { id: 'LD', name: 'Ladies Quota', badge: 'Reserved' },
  { id: 'SS', name: 'Senior Citizen', badge: 'Concession' },
  { id: 'DP', name: 'Divyang / Accessible', badge: 'Priority' },
];

export const MOCK_TRAINS: Train[] = [
  {
    id: 'tr-22436',
    number: '22436',
    name: 'Vande Bharat Express',
    type: 'Vande Bharat',
    origin: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    destination: { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi' },
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    runsOnDays: [0, 2, 3, 5, 6], // Sun, Tue, Wed, Fri, Sat
    totalDistanceKm: 759,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
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
    origin: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    destination: { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai' },
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6], // Daily
    totalDistanceKm: 1386,
    pantryAvailable: true,
    cleanlinessRating: 4.8,
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
    id: 'tr-12951',
    number: '12951',
    name: 'Tejas Rajdhani Express',
    type: 'Rajdhani Express',
    origin: { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai' },
    destination: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    departureTime: '17:00',
    arrivalTime: '08:32',
    duration: '15h 32m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 1386,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 8, basePrice: 4850, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 42, basePrice: 2950, coachCode: 'A1' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 112, basePrice: 2150, coachCode: 'B2' },
    },
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: 'Start', departureTime: '17:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 2 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '19:43', departureTime: '19:48', haltMinutes: 5, distanceKm: 263, day: 1, platform: 1 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:06', departureTime: '21:16', haltMinutes: 10, distanceKm: 393, day: 1, platform: 3 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '03:15', departureTime: '03:25', haltMinutes: 10, distanceKm: 920, day: 2, platform: 1 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:32', departureTime: 'Ends', haltMinutes: 0, distanceKm: 1386, day: 2, platform: 4 },
    ],
  },
  {
    id: 'tr-12002',
    number: '12002',
    name: 'Bhopal Shatabdi Express',
    type: 'Shatabdi Express',
    origin: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    destination: { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal' },
    departureTime: '06:00',
    arrivalTime: '14:40',
    duration: '8h 40m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 708,
    pantryAvailable: true,
    cleanlinessRating: 4.7,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 14, basePrice: 2310, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 86, basePrice: 1180, coachCode: 'C2' },
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '06:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 1 },
      { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '07:50', departureTime: '07:55', haltMinutes: 5, distanceKm: 195, day: 1, platform: 1 },
      { stationCode: 'GWL', stationName: 'Gwalior Junction', arrivalTime: '09:23', departureTime: '09:28', haltMinutes: 5, distanceKm: 313, day: 1, platform: 2 },
      { stationCode: 'VGLJ', stationName: 'V Lakshmibai Jhansi', arrivalTime: '10:45', departureTime: '10:53', haltMinutes: 8, distanceKm: 411, day: 1, platform: 1 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '14:40', departureTime: 'Ends', haltMinutes: 0, distanceKm: 708, day: 1, platform: 2 },
    ],
  },
  {
    id: 'tr-12626',
    number: '12626',
    name: 'Kerala Superfast Express',
    type: 'Superfast Express',
    origin: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    destination: { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru' },
    departureTime: '20:10',
    arrivalTime: '06:45',
    duration: '34h 35m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 2380,
    pantryAvailable: true,
    cleanlinessRating: 4.5,
    classes: {
      '2A': { status: 'AVAILABLE', seatsAvailable: 19, basePrice: 3420, coachCode: 'A1' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 62, basePrice: 2360, coachCode: 'B3' },
      SL: { status: 'AVAILABLE', seatsAvailable: 140, basePrice: 890, coachCode: 'S5' },
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '20:10', haltMinutes: 0, distanceKm: 0, day: 1, platform: 5 },
      { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '22:20', departureTime: '22:25', haltMinutes: 5, distanceKm: 195, day: 1, platform: 3 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '05:20', departureTime: '05:30', haltMinutes: 10, distanceKm: 708, day: 2, platform: 1 },
      { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '11:45', departureTime: '11:50', haltMinutes: 5, distanceKm: 1098, day: 2, platform: 2 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '06:45', departureTime: 'Ends', haltMinutes: 0, distanceKm: 2380, day: 3, platform: 4 },
    ],
  },
  {
    id: 'tr-12009',
    number: '12009',
    name: 'Mumbai - Ahmedabad Shatabdi',
    type: 'Shatabdi Express',
    origin: { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai' },
    destination: { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
    departureTime: '06:20',
    arrivalTime: '12:45',
    duration: '6h 25m',
    runsOnDays: [1, 2, 3, 4, 5, 6],
    totalDistanceKm: 493,
    pantryAvailable: true,
    cleanlinessRating: 4.8,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 22, basePrice: 2250, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 110, basePrice: 1120, coachCode: 'C1' },
    },
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: 'Start', departureTime: '06:20', haltMinutes: 0, distanceKm: 0, day: 1, platform: 1 },
      { stationCode: 'BVI', stationName: 'Borivali', arrivalTime: '06:43', departureTime: '06:45', haltMinutes: 2, distanceKm: 30, day: 1, platform: 6 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '09:15', departureTime: '09:18', haltMinutes: 3, distanceKm: 263, day: 1, platform: 1 },
      { stationCode: 'BRC', stationName: 'Vadodara', arrivalTime: '10:40', departureTime: '10:43', haltMinutes: 3, distanceKm: 393, day: 1, platform: 3 },
      { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '12:45', departureTime: 'Ends', haltMinutes: 0, distanceKm: 493, day: 1, platform: 1 },
    ],
  },
  {
    id: 'tr-20608',
    number: '20608',
    name: 'Mysuru - Chennai Vande Bharat',
    type: 'Vande Bharat',
    origin: { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru' },
    destination: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    departureTime: '14:50',
    arrivalTime: '19:20',
    duration: '4h 30m',
    runsOnDays: [0, 1, 2, 4, 5, 6],
    totalDistanceKm: 359,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
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
    id: 'tr-12301',
    number: '12301',
    name: 'Howrah Rajdhani Express',
    type: 'Rajdhani Express',
    origin: { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
    destination: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    departureTime: '16:50',
    arrivalTime: '10:05',
    duration: '17h 15m',
    runsOnDays: [1, 2, 3, 4, 5, 6],
    totalDistanceKm: 1451,
    pantryAvailable: true,
    cleanlinessRating: 4.7,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 4, basePrice: 4950, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 26, basePrice: 3050, coachCode: 'A2' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 58, basePrice: 2220, coachCode: 'B1' },
    },
    stops: [
      { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: 'Start', departureTime: '16:50', haltMinutes: 0, distanceKm: 0, day: 1, platform: 9 },
      { stationCode: 'ASN', stationName: 'Asansol Junction', arrivalTime: '18:57', departureTime: '19:00', haltMinutes: 3, distanceKm: 200, day: 1, platform: 4 },
      { stationCode: 'DHN', stationName: 'Dhanbad Junction', arrivalTime: '19:50', departureTime: '19:55', haltMinutes: 5, distanceKm: 259, day: 1, platform: 3 },
      { stationCode: 'DDU', stationName: 'Pt DD Upadhyaya', arrivalTime: '00:45', departureTime: '00:55', haltMinutes: 10, distanceKm: 664, day: 2, platform: 2 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '04:50', departureTime: '04:55', haltMinutes: 5, distanceKm: 1012, day: 2, platform: 1 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '10:05', departureTime: 'Ends', haltMinutes: 0, distanceKm: 1451, day: 2, platform: 12 },
    ],
  },
  {
    id: 'tr-12015',
    number: '12015',
    name: 'Ajmer Shatabdi Express',
    type: 'Shatabdi Express',
    origin: { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi' },
    destination: { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
    departureTime: '06:10',
    arrivalTime: '10:40',
    duration: '4h 30m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 308,
    pantryAvailable: true,
    cleanlinessRating: 4.8,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 18, basePrice: 1840, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 76, basePrice: 940, coachCode: 'C2' },
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '06:10', haltMinutes: 0, distanceKm: 0, day: 1, platform: 2 },
      { stationCode: 'DEC', stationName: 'Delhi Cantt', arrivalTime: '06:38', departureTime: '06:40', haltMinutes: 2, distanceKm: 16, day: 1, platform: 1 },
      { stationCode: 'GGN', stationName: 'Gurgaon', arrivalTime: '06:56', departureTime: '06:58', haltMinutes: 2, distanceKm: 32, day: 1, platform: 1 },
      { stationCode: 'AWR', stationName: 'Alwar Junction', arrivalTime: '08:42', departureTime: '08:45', haltMinutes: 3, distanceKm: 175, day: 1, platform: 2 },
      { stationCode: 'JP', stationName: 'Jaipur Junction', arrivalTime: '10:40', departureTime: 'Ends', haltMinutes: 0, distanceKm: 308, day: 1, platform: 3 },
    ],
  },
  {
    id: 'tr-12124',
    number: '12124',
    name: 'Deccan Queen Superfast',
    type: 'Superfast Express',
    origin: { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
    destination: { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai' },
    departureTime: '07:15',
    arrivalTime: '10:25',
    duration: '3h 10m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 192,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
    classes: {
      CC: { status: 'AVAILABLE', seatsAvailable: 124, basePrice: 480, coachCode: 'C1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 32, basePrice: 750, coachCode: 'A1' },
    },
    stops: [
      { stationCode: 'PUNE', stationName: 'Pune Junction', arrivalTime: 'Start', departureTime: '07:15', haltMinutes: 0, distanceKm: 0, day: 1, platform: 5 },
      { stationCode: 'LNL', stationName: 'Lonavala', arrivalTime: '08:08', departureTime: '08:10', haltMinutes: 2, distanceKm: 64, day: 1, platform: 2 },
      { stationCode: 'DR', stationName: 'Dadar Central', arrivalTime: '10:03', departureTime: '10:05', haltMinutes: 2, distanceKm: 183, day: 1, platform: 6 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '10:25', departureTime: 'Ends', haltMinutes: 0, distanceKm: 192, day: 1, platform: 8 },
    ],
  },
  {
    id: 'tr-12760',
    number: '12760',
    name: 'Charminar Superfast Express',
    type: 'Superfast Express',
    origin: { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
    destination: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    departureTime: '18:00',
    arrivalTime: '07:55',
    duration: '13h 55m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 790,
    pantryAvailable: true,
    cleanlinessRating: 4.8,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 6, basePrice: 3180, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 24, basePrice: 1890, coachCode: 'A1' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 68, basePrice: 1340, coachCode: 'B3' },
      SL: { status: 'AVAILABLE', seatsAvailable: 122, basePrice: 495, coachCode: 'S4' },
    },
    stops: [
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: 'Start', departureTime: '18:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 5 },
      { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '18:20', departureTime: '18:25', haltMinutes: 5, distanceKm: 10, day: 1, platform: 1 },
      { stationCode: 'KZJ', stationName: 'Kazipet Junction', arrivalTime: '20:28', departureTime: '20:30', haltMinutes: 2, distanceKm: 142, day: 1, platform: 1 },
      { stationCode: 'BZA', stationName: 'Vijayawada Junction', arrivalTime: '00:05', departureTime: '00:15', haltMinutes: 10, distanceKm: 358, day: 2, platform: 7 },
      { stationCode: 'OGL', stationName: 'Ongole', arrivalTime: '02:18', departureTime: '02:20', haltMinutes: 2, distanceKm: 497, day: 2, platform: 3 },
      { stationCode: 'NLR', stationName: 'Nellore', arrivalTime: '03:43', departureTime: '03:45', haltMinutes: 2, distanceKm: 613, day: 2, platform: 3 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '07:55', departureTime: 'Ends', haltMinutes: 0, distanceKm: 790, day: 2, platform: 4 },
    ],
  },
  {
    id: 'tr-12604',
    number: '12604',
    name: 'Chennai Central SF Express',
    type: 'Superfast Express',
    origin: { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
    destination: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    departureTime: '16:45',
    arrivalTime: '05:40',
    duration: '12h 55m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 715,
    pantryAvailable: true,
    cleanlinessRating: 4.7,
    classes: {
      '2A': { status: 'AVAILABLE', seatsAvailable: 18, basePrice: 1780, coachCode: 'A1' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 52, basePrice: 1260, coachCode: 'B2' },
      SL: { status: 'AVAILABLE', seatsAvailable: 98, basePrice: 465, coachCode: 'S3' },
    },
    stops: [
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: 'Start', departureTime: '16:45', haltMinutes: 0, distanceKm: 0, day: 1, platform: 6 },
      { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '17:05', departureTime: '17:10', haltMinutes: 5, distanceKm: 10, day: 1, platform: 2 },
      { stationCode: 'GNT', stationName: 'Guntur Junction', arrivalTime: '22:15', departureTime: '22:20', haltMinutes: 5, distanceKm: 382, day: 1, platform: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '05:40', departureTime: 'Ends', haltMinutes: 0, distanceKm: 715, day: 2, platform: 3 },
    ],
  },
  {
    id: 'tr-20678',
    number: '20678',
    name: 'Hyderabad - Chennai Vande Bharat',
    type: 'Vande Bharat',
    origin: { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
    destination: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    departureTime: '06:15',
    arrivalTime: '14:30',
    duration: '8h 15m',
    runsOnDays: [0, 1, 2, 3, 5, 6],
    totalDistanceKm: 715,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 24, basePrice: 2480, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 88, basePrice: 1290, coachCode: 'C2' },
    },
    stops: [
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: 'Start', departureTime: '06:15', haltMinutes: 0, distanceKm: 0, day: 1, platform: 1 },
      { stationCode: 'NLDA', stationName: 'Nalgonda', arrivalTime: '07:30', departureTime: '07:32', haltMinutes: 2, distanceKm: 110, day: 1, platform: 2 },
      { stationCode: 'GNT', stationName: 'Guntur Junction', arrivalTime: '10:00', departureTime: '10:05', haltMinutes: 5, distanceKm: 382, day: 1, platform: 1 },
      { stationCode: 'OGL', stationName: 'Ongole', arrivalTime: '11:28', departureTime: '11:30', haltMinutes: 2, distanceKm: 497, day: 1, platform: 3 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '14:30', departureTime: 'Ends', haltMinutes: 0, distanceKm: 715, day: 1, platform: 2 },
    ],
  },
  {
    id: 'tr-12759',
    number: '12759',
    name: 'Charminar Superfast Express',
    type: 'Superfast Express',
    origin: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    destination: { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
    departureTime: '18:10',
    arrivalTime: '08:00',
    duration: '13h 50m',
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    totalDistanceKm: 790,
    pantryAvailable: true,
    cleanlinessRating: 4.8,
    classes: {
      '1A': { status: 'AVAILABLE', seatsAvailable: 8, basePrice: 3180, coachCode: 'H1' },
      '2A': { status: 'AVAILABLE', seatsAvailable: 28, basePrice: 1890, coachCode: 'A1' },
      '3A': { status: 'AVAILABLE', seatsAvailable: 74, basePrice: 1340, coachCode: 'B2' },
      SL: { status: 'AVAILABLE', seatsAvailable: 110, basePrice: 495, coachCode: 'S2' },
    },
    stops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: 'Start', departureTime: '18:10', haltMinutes: 0, distanceKm: 0, day: 1, platform: 4 },
      { stationCode: 'NLR', stationName: 'Nellore', arrivalTime: '21:03', departureTime: '21:05', haltMinutes: 2, distanceKm: 177, day: 1, platform: 2 },
      { stationCode: 'OGL', stationName: 'Ongole', arrivalTime: '22:33', departureTime: '22:35', haltMinutes: 2, distanceKm: 293, day: 1, platform: 1 },
      { stationCode: 'BZA', stationName: 'Vijayawada Junction', arrivalTime: '01:10', departureTime: '01:20', haltMinutes: 10, distanceKm: 432, day: 2, platform: 6 },
      { stationCode: 'KZJ', stationName: 'Kazipet Junction', arrivalTime: '04:33', departureTime: '04:35', haltMinutes: 2, distanceKm: 648, day: 2, platform: 2 },
      { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '07:15', departureTime: '07:20', haltMinutes: 5, distanceKm: 780, day: 2, platform: 5 },
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: '08:00', departureTime: 'Ends', haltMinutes: 0, distanceKm: 790, day: 2, platform: 5 },
    ],
  },
  {
    id: 'tr-20677',
    number: '20677',
    name: 'Chennai - Hyderabad Vande Bharat',
    type: 'Vande Bharat',
    origin: { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
    destination: { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
    departureTime: '05:30',
    arrivalTime: '13:45',
    duration: '8h 15m',
    runsOnDays: [0, 1, 2, 4, 5, 6],
    totalDistanceKm: 715,
    pantryAvailable: true,
    cleanlinessRating: 4.9,
    classes: {
      EC: { status: 'AVAILABLE', seatsAvailable: 28, basePrice: 2480, coachCode: 'E1' },
      CC: { status: 'AVAILABLE', seatsAvailable: 96, basePrice: 1290, coachCode: 'C1' },
    },
    stops: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: 'Start', departureTime: '05:30', haltMinutes: 0, distanceKm: 0, day: 1, platform: 2 },
      { stationCode: 'OGL', stationName: 'Ongole', arrivalTime: '08:38', departureTime: '08:40', haltMinutes: 2, distanceKm: 218, day: 1, platform: 1 },
      { stationCode: 'GNT', stationName: 'Guntur Junction', arrivalTime: '10:00', departureTime: '10:05', haltMinutes: 5, distanceKm: 333, day: 1, platform: 1 },
      { stationCode: 'NLDA', stationName: 'Nalgonda', arrivalTime: '12:08', departureTime: '12:10', haltMinutes: 2, distanceKm: 605, day: 1, platform: 2 },
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: '13:45', departureTime: 'Ends', haltMinutes: 0, distanceKm: 715, day: 1, platform: 1 },
    ],
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-94819284',
    pnr: '842-1984210',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    trainType: 'Vande Bharat',
    originCode: 'NDLS',
    originName: 'New Delhi Railway Station',
    destinationCode: 'BSB',
    destinationName: 'Varanasi Junction',
    journeyDate: '2026-10-04',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    classCode: 'CC',
    className: 'AC Chair Car',
    quota: 'General Quota',
    passengers: [
      {
        id: 'p-1',
        fullName: 'Rahul Sharma',
        age: 32,
        gender: 'male',
        berthPreference: 'Window',
        foodChoice: 'Veg',
        assignedCoach: 'C3',
        assignedSeat: '24',
        assignedBerthType: 'Window',
      },
      {
        id: 'p-2',
        fullName: 'Ananya Sharma',
        age: 29,
        gender: 'female',
        berthPreference: 'Aisle',
        foodChoice: 'Veg',
        assignedCoach: 'C3',
        assignedSeat: '25',
        assignedBerthType: 'Aisle',
      },
    ],
    contactEmail: 'rahul.travel@example.com',
    contactPhone: '+91 98765 43210',
    baseFare: 2950,
    reservationFee: 80,
    tax: 151,
    insuranceFee: 30,
    totalFare: 3211,
    paymentMethod: 'UPI - Instant Transfer',
    transactionId: 'TXN-9842019482',
    status: 'CONFIRMED',
    bookedAt: '2026-09-28T14:30:00Z',
    platformNumber: 16,
  },
  {
    id: 'bk-10492837',
    pnr: '219-5839201',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    trainType: 'Rajdhani Express',
    originCode: 'NDLS',
    originName: 'New Delhi Railway Station',
    destinationCode: 'MMCT',
    destinationName: 'Mumbai Central',
    journeyDate: '2026-10-12',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    classCode: '2A',
    className: 'AC 2-Tier',
    quota: 'General Quota',
    passengers: [
      {
        id: 'p-3',
        fullName: 'Vikram Malhotra',
        age: 45,
        gender: 'male',
        berthPreference: 'Lower',
        foodChoice: 'Non-Veg',
        assignedCoach: 'A2',
        assignedSeat: '17',
        assignedBerthType: 'Lower Berth',
      },
    ],
    contactEmail: 'v.malhotra@corpmail.com',
    contactPhone: '+91 91234 56789',
    baseFare: 2890,
    reservationFee: 40,
    tax: 146,
    insuranceFee: 15,
    totalFare: 3091,
    paymentMethod: 'Credit Card (Visa)',
    transactionId: 'TXN-4920491823',
    status: 'CONFIRMED',
    bookedAt: '2026-09-27T09:15:00Z',
    platformNumber: 3,
  }
];

export const STORAGE_KEY_BOOKINGS = 'rail_express_bookings_v1';

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: Booking): void {
  const current = getStoredBookings();
  const updated = [booking, ...current];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
}

export function updateBooking(bookingId: string, updates: Partial<Booking>): Booking | null {
  const current = getStoredBookings();
  let updatedBooking: Booking | null = null;
  const updated = current.map((b) => {
    if (b.id === bookingId) {
      updatedBooking = { ...b, ...updates };
      return updatedBooking;
    }
    return b;
  });
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  return updatedBooking;
}

export function generatePnr(): string {
  const p1 = Math.floor(100 + Math.random() * 900);
  const p2 = Math.floor(1000000 + Math.random() * 9000000);
  return `${p1}-${p2}`;
}

export function getTrainsForRoute(fromCode: string, toCode: string): Train[] {
  // 1. Direct matches in database
  const directMatches = MOCK_TRAINS.filter(
    (t) => t.origin.code === fromCode && t.destination.code === toCode
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  // 2. Synthesize accurate, customized trains specifically for this origin and destination
  const fromStation = STATIONS.find((s) => s.code === fromCode) || {
    code: fromCode,
    name: `${fromCode} Station`,
    city: fromCode,
    state: '',
    platforms: 6,
  };

  const toStation = STATIONS.find((s) => s.code === toCode) || {
    code: toCode,
    name: `${toCode} Station`,
    city: toCode,
    state: '',
    platforms: 6,
  };

  // Generate deterministic train numbers based on station codes
  const baseNum = Math.abs(
    (fromCode.charCodeAt(0) * 31 + toCode.charCodeAt(0) * 17) % 8000
  ) + 12000;

  const t1Num = `${baseNum}`;
  const t2Num = `${baseNum + 10}`;
  const t3Num = `${baseNum + 24}`;

  return [
    {
      id: `tr-gen-${t1Num}`,
      number: t1Num,
      name: `${fromStation.city} - ${toStation.city} Vande Bharat`,
      type: 'Vande Bharat',
      origin: {
        code: fromStation.code,
        name: fromStation.name,
        city: fromStation.city,
      },
      destination: {
        code: toStation.code,
        name: toStation.name,
        city: toStation.city,
      },
      departureTime: '06:00',
      arrivalTime: '14:20',
      duration: '8h 20m',
      runsOnDays: [0, 1, 2, 3, 5, 6],
      totalDistanceKm: 720,
      pantryAvailable: true,
      cleanlinessRating: 4.9,
      classes: {
        EC: { status: 'AVAILABLE', seatsAvailable: 28, basePrice: 2350, coachCode: 'E1' },
        CC: { status: 'AVAILABLE', seatsAvailable: 110, basePrice: 1240, coachCode: 'C2' },
      },
      stops: [
        {
          stationCode: fromStation.code,
          stationName: fromStation.name,
          arrivalTime: 'Start',
          departureTime: '06:00',
          haltMinutes: 0,
          distanceKm: 0,
          day: 1,
          platform: 1,
        },
        {
          stationCode: 'WAY1',
          stationName: 'Central Junction',
          arrivalTime: '10:15',
          departureTime: '10:20',
          haltMinutes: 5,
          distanceKm: 360,
          day: 1,
          platform: 2,
        },
        {
          stationCode: toStation.code,
          stationName: toStation.name,
          arrivalTime: '14:20',
          departureTime: 'Ends',
          haltMinutes: 0,
          distanceKm: 720,
          day: 1,
          platform: 2,
        },
      ],
    },
    {
      id: `tr-gen-${t2Num}`,
      number: t2Num,
      name: `${fromStation.city} - ${toStation.city} Superfast Express`,
      type: 'Superfast Express',
      origin: {
        code: fromStation.code,
        name: fromStation.name,
        city: fromStation.city,
      },
      destination: {
        code: toStation.code,
        name: toStation.name,
        city: toStation.city,
      },
      departureTime: '17:30',
      arrivalTime: '06:45',
      duration: '13h 15m',
      runsOnDays: [0, 1, 2, 3, 4, 5, 6],
      totalDistanceKm: 790,
      pantryAvailable: true,
      cleanlinessRating: 4.7,
      classes: {
        '2A': { status: 'AVAILABLE', seatsAvailable: 22, basePrice: 1820, coachCode: 'A1' },
        '3A': { status: 'AVAILABLE', seatsAvailable: 64, basePrice: 1290, coachCode: 'B3' },
        SL: { status: 'AVAILABLE', seatsAvailable: 130, basePrice: 480, coachCode: 'S4' },
      },
      stops: [
        {
          stationCode: fromStation.code,
          stationName: fromStation.name,
          arrivalTime: 'Start',
          departureTime: '17:30',
          haltMinutes: 0,
          distanceKm: 0,
          day: 1,
          platform: 3,
        },
        {
          stationCode: 'WAY2',
          stationName: 'Intercity Junction',
          arrivalTime: '23:45',
          departureTime: '23:55',
          haltMinutes: 10,
          distanceKm: 420,
          day: 1,
          platform: 1,
        },
        {
          stationCode: toStation.code,
          stationName: toStation.name,
          arrivalTime: '06:45',
          departureTime: 'Ends',
          haltMinutes: 0,
          distanceKm: 790,
          day: 2,
          platform: 4,
        },
      ],
    },
    {
      id: `tr-gen-${t3Num}`,
      number: t3Num,
      name: `${fromStation.city} - ${toStation.city} Intercity SF`,
      type: 'Superfast Express',
      origin: {
        code: fromStation.code,
        name: fromStation.name,
        city: fromStation.city,
      },
      destination: {
        code: toStation.code,
        name: toStation.name,
        city: toStation.city,
      },
      departureTime: '11:15',
      arrivalTime: '22:30',
      duration: '11h 15m',
      runsOnDays: [0, 1, 2, 3, 4, 5, 6],
      totalDistanceKm: 750,
      pantryAvailable: true,
      cleanlinessRating: 4.6,
      classes: {
        '1A': { status: 'AVAILABLE', seatsAvailable: 6, basePrice: 2950, coachCode: 'H1' },
        '2A': { status: 'AVAILABLE', seatsAvailable: 30, basePrice: 1750, coachCode: 'A2' },
        '3A': { status: 'AVAILABLE', seatsAvailable: 85, basePrice: 1220, coachCode: 'B1' },
        SL: { status: 'AVAILABLE', seatsAvailable: 145, basePrice: 450, coachCode: 'S1' },
      },
      stops: [
        {
          stationCode: fromStation.code,
          stationName: fromStation.name,
          arrivalTime: 'Start',
          departureTime: '11:15',
          haltMinutes: 0,
          distanceKm: 0,
          day: 1,
          platform: 2,
        },
        {
          stationCode: toStation.code,
          stationName: toStation.name,
          arrivalTime: '22:30',
          departureTime: 'Ends',
          haltMinutes: 0,
          distanceKm: 750,
          day: 1,
          platform: 1,
        },
      ],
    },
  ];
}


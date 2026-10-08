export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  platforms: number;
}

export interface TravelClass {
  code: string;
  name: string;
  shortDescription: string;
  multiplier: number;
  berthType: 'sleeper' | 'chair' | 'executive';
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: number;
}

export interface ClassAvailability {
  status: 'AVAILABLE' | 'RAC' | 'WL';
  seatsAvailable: number;
  basePrice: number;
  coachCode: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Vande Bharat' | 'Rajdhani Express' | 'Shatabdi Express' | 'Superfast Express' | 'Mail Express';
  origin: {
    code: string;
    name: string;
    city: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOnDays: number[]; // 0: Sun, 1: Mon, ... 6: Sat
  classes: Record<string, ClassAvailability>;
  stops: TrainStop[];
  totalDistanceKm: number;
  pantryAvailable: boolean;
  cleanlinessRating: number;
}

export interface Passenger {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  berthPreference: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle' | 'No Preference';
  foodChoice: 'Veg' | 'Non-Veg' | 'No Food';
  assignedCoach?: string;
  assignedSeat?: string;
  assignedBerthType?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  trainType: string;
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classCode: string;
  className: string;
  quota: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  baseFare: number;
  reservationFee: number;
  tax: number;
  insuranceFee: number;
  totalFare: number;
  paymentMethod: string;
  transactionId: string;
  status: 'CONFIRMED' | 'CANCELLED';
  bookedAt: string;
  cancelledAt?: string;
  refundAmount?: number;
  platformNumber: number;
  eTicketSentEmail?: boolean;
  eTicketSentMobile?: boolean;
  eTicketDeliveryChannel?: 'email' | 'mobile' | 'both';
}

export interface CoachSeat {
  seatNumber: number;
  label: string;
  berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle';
  isBooked: boolean;
}

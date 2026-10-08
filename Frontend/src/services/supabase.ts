import { createClient } from '@supabase/supabase-js';
import { Booking, Train, Station } from '../types/railway';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://gevzqlphosoimdfpzmxx.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_0MP3wyOBRPeALzmkO0QSxg_9nsbulTK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to convert database snake_case row to frontend Booking model
export function mapRowToBooking(row: any): Booking {
  return {
    id: row.id,
    pnr: row.pnr,
    trainNumber: row.train_number,
    trainName: row.train_name,
    trainType: row.train_type || 'Superfast Express',
    originCode: row.origin_code,
    originName: row.origin_name || row.origin_code,
    destinationCode: row.destination_code,
    destinationName: row.destination_name || row.destination_code,
    journeyDate: row.journey_date,
    departureTime: row.departure_time || '00:00',
    arrivalTime: row.arrival_time || '00:00',
    duration: row.duration || '',
    classCode: row.class_code,
    className: row.class_name || `${row.class_code} Class`,
    quota: row.quota || 'General Quota',
    passengers: Array.isArray(row.passengers) ? row.passengers : [],
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    baseFare: Number(row.base_fare || 0),
    reservationFee: Number(row.reservation_fee || 0),
    tax: Number(row.tax || 0),
    insuranceFee: Number(row.insurance_fee || 0),
    totalFare: Number(row.total_fare || 0),
    paymentMethod: row.payment_method || 'Online Payment',
    transactionId: row.transaction_id || '',
    status: (row.status || 'CONFIRMED') as 'CONFIRMED' | 'CANCELLED',
    bookedAt: row.booked_at || new Date().toISOString(),
    cancelledAt: row.cancelled_at || undefined,
    refundAmount: row.refund_amount ? Number(row.refund_amount) : undefined,
    platformNumber: row.platform_number || 1,
  };
}

// Helper to convert frontend Booking model to database snake_case row
export function mapBookingToRow(b: Booking) {
  return {
    id: b.id,
    pnr: b.pnr,
    train_number: b.trainNumber,
    train_name: b.trainName,
    train_type: b.trainType,
    origin_code: b.originCode,
    origin_name: b.originName,
    destination_code: b.destinationCode,
    destination_name: b.destinationName,
    journey_date: b.journeyDate,
    departure_time: b.departureTime,
    arrival_time: b.arrivalTime,
    duration: b.duration,
    class_code: b.classCode,
    class_name: b.className,
    quota: b.quota,
    passengers: b.passengers,
    contact_email: b.contactEmail,
    contact_phone: b.contactPhone,
    base_fare: b.baseFare,
    reservation_fee: b.reservationFee,
    tax: b.tax,
    insurance_fee: b.insuranceFee,
    total_fare: b.totalFare,
    payment_method: b.paymentMethod,
    transaction_id: b.transactionId,
    status: b.status,
    booked_at: b.bookedAt,
    cancelled_at: b.cancelledAt || null,
    refund_amount: b.refundAmount || 0,
    platform_number: b.platformNumber || 1,
  };
}

/**
 * Fetch all bookings from Supabase
 */
export async function getSupabaseBookings(): Promise<Booking[] | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booked_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Could not fetch bookings:', error.message);
      return null;
    }

    if (data) {
      return data.map(mapRowToBooking);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase] Fetch error:', err);
    return null;
  }
}

/**
 * Save new booking to Supabase
 */
export async function saveBookingToSupabase(booking: Booking): Promise<{ success: boolean; error?: string }> {
  try {
    const row = mapBookingToRow(booking);
    const { error } = await supabase.from('bookings').insert([row]);

    if (error) {
      console.error('[Supabase] Error saving booking:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error saving booking:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Update booking status (e.g. cancellation) in Supabase
 */
export async function updateBookingInSupabase(
  bookingId: string,
  updates: Partial<Booking>
): Promise<{ success: boolean; error?: string }> {
  try {
    const rowUpdates: Record<string, any> = {};
    if (updates.status) rowUpdates.status = updates.status;
    if (updates.cancelledAt) rowUpdates.cancelled_at = updates.cancelledAt;
    if (updates.refundAmount !== undefined) rowUpdates.refund_amount = updates.refundAmount;

    const { error } = await supabase
      .from('bookings')
      .update(rowUpdates)
      .eq('id', bookingId);

    if (error) {
      console.error('[Supabase] Error updating booking:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error updating booking:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Find booking by PNR from Supabase
 */
export async function getBookingByPnrFromSupabase(pnr: string): Promise<Booking | null> {
  try {
    const raw = pnr.trim();
    const cleanDigits = raw.replace(/[^0-9]/g, '');

    // Search by exact match or formatted match
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`pnr.eq.${raw},pnr.eq.${cleanDigits},pnr.ilike.%${cleanDigits}%`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToBooking(data);
  } catch (e) {
    console.warn('[Supabase] PNR query error:', e);
    return null;
  }
}

/**
 * Sync all local bookings to Supabase in bulk
 */
export async function syncLocalBookingsToSupabase(
  localBookings: Booking[]
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!localBookings || localBookings.length === 0) {
      return { success: true, count: 0 };
    }
    const rows = localBookings.map(mapBookingToRow);
    const { error } = await supabase
      .from('bookings')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    return { success: true, count: rows.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Sync failed' };
  }
}

/**
 * Test connectivity and check if bookings table exists
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; tableReady: boolean; message: string }> {
  try {
    const { error } = await supabase.from('bookings').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          tableReady: false,
          message: "Connected to Supabase, but the 'bookings' table hasn't been created yet. Please run the SQL schema script in Supabase SQL editor.",
        };
      }
      return {
        connected: false,
        tableReady: false,
        message: error.message,
      };
    }

    return {
      connected: true,
      tableReady: true,
      message: "Connected to Supabase! Database is ready.",
    };
  } catch (err: any) {
    return {
      connected: false,
      tableReady: false,
      message: err.message || 'Failed to connect to Supabase.',
    };
  }
}

/**
 * Helper to convert database row to Train model
 */
export function mapRowToTrain(row: any): Train {
  return {
    id: row.id,
    number: row.number,
    name: row.name,
    type: row.type,
    origin: {
      code: row.origin_code,
      name: row.origin_name,
      city: row.origin_city,
    },
    destination: {
      code: row.destination_code,
      name: row.destination_name,
      city: row.destination_city,
    },
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    duration: row.duration,
    runsOnDays: Array.isArray(row.runs_on_days) ? row.runs_on_days : [0, 1, 2, 3, 4, 5, 6],
    classes: row.classes || {},
    stops: Array.isArray(row.stops) ? row.stops : [],
    totalDistanceKm: Number(row.total_distance_km || 0),
    pantryAvailable: Boolean(row.pantry_available),
    cleanlinessRating: Number(row.cleanliness_rating || 4.5),
  };
}

/**
 * Fetch trains from Supabase, with optional route filtering
 */
export async function getSupabaseTrains(fromCode?: string, toCode?: string): Promise<Train[] | null> {
  try {
    let query = supabase.from('trains').select('*');
    if (fromCode && toCode) {
      query = query.eq('origin_code', fromCode).eq('destination_code', toCode);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Could not fetch trains:', error.message);
      return null;
    }
    if (data && data.length > 0) {
      return data.map(mapRowToTrain);
    }
    return [];
  } catch (err) {
    console.warn('[Supabase] Trains fetch error:', err);
    return null;
  }
}

/**
 * Fetch stations from Supabase
 */
export async function getSupabaseStations(): Promise<Station[] | null> {
  try {
    const { data, error } = await supabase.from('stations').select('*').order('name');
    if (error) return null;
    return (data || []).map((row) => ({
      code: row.code,
      name: row.name,
      city: row.city,
      state: row.state,
      platforms: row.platforms || 6,
    }));
  } catch {
    return null;
  }
}


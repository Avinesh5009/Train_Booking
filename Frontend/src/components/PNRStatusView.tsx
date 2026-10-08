import React, { useState } from 'react';
import { Search, Ticket, CheckCircle2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Booking } from '../types/railway';
import { getBookingByPnrFromSupabase } from '../services/supabase';

interface PNRStatusViewProps {
  bookings: Booking[];
  onOpenETicket: (booking: Booking) => void;
  onBookingFound?: (booking: Booking) => void;
}

export const PNRStatusView: React.FC<PNRStatusViewProps> = ({
  bookings,
  onOpenETicket,
  onBookingFound,
}) => {
  const [pnrInput, setPnrInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(
    bookings.length > 0 ? bookings[0] : null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pnrInput.trim().replace(/[^0-9]/g, '');
    if (!clean && !pnrInput.trim()) {
      setErrorMsg('Please enter a valid PNR number.');
      return;
    }

    // 1. Check local in-memory bookings first
    const found = bookings.find((b) => {
      const bDigits = b.pnr.replace(/[^0-9]/g, '');
      return bDigits === clean || b.pnr.toLowerCase() === pnrInput.toLowerCase().trim();
    });

    if (found) {
      setSearchedBooking(found);
      setErrorMsg(null);
      return;
    }

    // 2. Query Supabase database
    setIsSearching(true);
    setErrorMsg(null);
    try {
      const remote = await getBookingByPnrFromSupabase(pnrInput);
      if (remote) {
        setSearchedBooking(remote);
        setErrorMsg(null);
        if (onBookingFound) {
          onBookingFound(remote);
        }
      } else {
        setSearchedBooking(null);
        setErrorMsg(`No ticket found for PNR "${pnrInput}" in database or locally.`);
      }
    } catch {
      setErrorMsg(`Error searching for PNR "${pnrInput}". Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Check PNR Status
          </h2>
          <p className="text-xs text-slate-500">
            Enter your 10-digit PNR to see your booking status and seat details.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={pnrInput}
            onChange={(e) => {
              setPnrInput(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="e.g. 842-1984210"
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching DB...</span>
              </>
            ) : (
              <span>Check Status</span>
            )}
          </button>
        </form>

        {bookings.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Quick check:</span>
            {bookings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setPnrInput(b.pnr);
                  setSearchedBooking(b);
                  setErrorMsg(null);
                }}
                className="font-mono text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
              >
                {b.pnr}
              </button>
            ))}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
          {errorMsg}
        </div>
      )}

      {searchedBooking && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs text-slate-500 block">PNR Number</span>
              <strong className="font-mono text-lg font-bold text-slate-900">
                {searchedBooking.pnr}
              </strong>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded ${
                searchedBooking.status === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {searchedBooking.status}
            </span>
          </div>

          {/* Train Route */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">TRAIN</span>
              <strong className="text-slate-900 block font-semibold">
                #{searchedBooking.trainNumber} {searchedBooking.trainName}
              </strong>
              <span className="text-slate-500">{searchedBooking.className}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">DATE & ROUTE</span>
              <strong className="text-slate-900 block font-semibold">
                {searchedBooking.journeyDate}
              </strong>
              <span className="text-slate-500">
                {searchedBooking.originCode} → {searchedBooking.destinationCode} (Platform #{searchedBooking.platformNumber})
              </span>
            </div>
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Passenger List & Seats
            </span>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
              {searchedBooking.passengers.map((p, idx) => (
                <div key={p.id} className="p-2.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800">{p.fullName}</strong>
                    <span className="text-slate-500 ml-2 font-mono">
                      ({p.age}, {p.gender})
                    </span>
                  </div>
                  <div className="font-mono font-bold text-emerald-700">
                    Coach {p.assignedCoach || 'B1'}, Seat {p.assignedSeat || '24'} ({p.assignedBerthType || p.berthPreference})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenETicket(searchedBooking)}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View & Print E-Ticket</span>
          </button>
        </div>
      )}
    </div>
  );
};

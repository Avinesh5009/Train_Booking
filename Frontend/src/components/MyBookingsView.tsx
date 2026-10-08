import React, { useState } from 'react';
import { Booking } from '../types/railway';
import { Ticket, FileText, ArrowRight, RefreshCw } from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  onOpenETicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onStartBooking: () => void;
  onRefreshBookings?: () => Promise<void>;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onOpenETicket,
  onCancelBooking,
  onStartBooking,
  onRefreshBookings,
}) => {
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefreshBookings) return;
    setIsRefreshing(true);
    try {
      await onRefreshBookings();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfirmCancel = () => {
    if (cancellingBooking) {
      onCancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            My Booked Tickets
          </h2>
          <p className="text-xs text-slate-500">
            View your upcoming train journeys, print tickets, or cancel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefreshBookings && (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
              title="Fetch latest bookings from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Supabase'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartBooking}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            + Book New Journey
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-xs">
          <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            No bookings found
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Search for trains on your desired route to book your ticket.
          </p>
          <button
            type="button"
            onClick={onStartBooking}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Find Trains
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                {/* Header line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">
                      PNR: {b.pnr}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-slate-900">
                    ₹{b.totalFare}
                  </span>
                </div>

                {/* Train and route */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-sm text-slate-900 block font-bold">
                      #{b.trainNumber} {b.trainName}
                    </strong>
                    <span className="text-slate-500">
                      {b.className} · {b.journeyDate}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-medium text-slate-700 block">
                      {b.originCode} ({b.departureTime}) → {b.destinationCode} ({b.arrivalTime})
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Platform #{b.platformNumber}
                    </span>
                  </div>
                </div>

                {/* Passengers & Action buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600">
                    {b.passengers.map((p) => `${p.fullName} (Seat ${p.assignedSeat || '21'})`).join(', ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenETicket(b)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                    >
                      View Ticket
                    </button>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(b)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md font-medium text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simple Cancel confirmation */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cancel this ticket?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                PNR {cancellingBooking.pnr} for #{cancellingBooking.trainNumber} {cancellingBooking.trainName}.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Original Fare:</span>
                <span className="font-mono">₹{cancellingBooking.totalFare}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cancellation Fee:</span>
                <span className="font-mono">- ₹{120 * cancellingBooking.passengers.length}</span>
              </div>
              <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Refund Amount:</span>
                <span className="font-mono text-emerald-700">
                  ₹{Math.max(0, cancellingBooking.totalFare - 120 * cancellingBooking.passengers.length)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium cursor-pointer"
              >
                No, Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

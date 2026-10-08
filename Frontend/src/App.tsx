/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrainSearchWidget } from './components/TrainSearchWidget';
import { TrainCard } from './components/TrainCard';
import { TrainScheduleModal } from './components/TrainScheduleModal';
import { SimpleBookingForm } from './components/PassengerDetailsStep';
import { ETicketModal } from './components/ETicketModal';
import { PNRStatusView } from './components/PNRStatusView';
import { MyBookingsView } from './components/MyBookingsView';
import {
  MOCK_TRAINS,
  STATIONS,
  getStoredBookings,
  saveBooking,
  updateBooking,
  generatePnr,
  getTrainsForRoute,
} from './data/mockRailwayData';
import { Train, Passenger, Booking } from './types/railway';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import {
  getSupabaseBookings,
  saveBookingToSupabase,
  updateBookingInSupabase,
} from './services/supabase';
import { deliverTicketToUser } from './services/ticketNotificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'pnr' | 'bookings'>('search');

  // Search parameters (defaults to Hyderabad to Chennai)
  const [fromCode, setFromCode] = useState('HYB');
  const [toCode, setToCode] = useState('MAS');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Modal / Selected train states
  const [scheduleModalTrain, setScheduleModalTrain] = useState<Train | null>(null);
  const [activeETicket, setActiveETicket] = useState<Booking | null>(null);

  // Booking step
  const [bookingTrain, setBookingTrain] = useState<Train | null>(null);
  const [bookingClassCode, setBookingClassCode] = useState<string>('3A');
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'p-1',
      fullName: 'Rahul Sharma',
      age: 32,
      gender: 'male',
      berthPreference: 'Lower',
      foodChoice: 'Veg',
      assignedCoach: 'B2',
      assignedSeat: '18',
      assignedBerthType: 'Lower',
    },
  ]);
  const [contactEmail, setContactEmail] = useState('rahul.sharma@example.com');
  const [contactPhone, setContactPhone] = useState('9876543210');

  // Bookings list in localStorage
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initial load from local storage for instant render
    const local = getStoredBookings();
    setBookings(local);

    // 2. Fetch fresh bookings from Supabase
    getSupabaseBookings().then((remoteBookings) => {
      if (remoteBookings && remoteBookings.length > 0) {
        const idMap = new Map<string, Booking>();
        local.forEach((b) => idMap.set(b.id, b));
        remoteBookings.forEach((b) => idMap.set(b.id, b));
        const merged = Array.from(idMap.values()).sort(
          (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
        );
        setBookings(merged);
        localStorage.setItem('railticket_bookings', JSON.stringify(merged));
      }
    });
  }, []);

  const handleRefreshSupabaseBookings = async () => {
    try {
      const remoteBookings = await getSupabaseBookings();
      if (remoteBookings && remoteBookings.length > 0) {
        const local = getStoredBookings();
        const idMap = new Map<string, Booking>();
        local.forEach((b) => idMap.set(b.id, b));
        remoteBookings.forEach((b) => idMap.set(b.id, b));
        const merged = Array.from(idMap.values()).sort(
          (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
        );
        setBookings(merged);
        localStorage.setItem('railticket_bookings', JSON.stringify(merged));
        triggerToast(`Synced ${remoteBookings.length} booking(s) from Supabase!`);
      } else if (remoteBookings && remoteBookings.length === 0) {
        triggerToast('No bookings found in Supabase yet.');
      } else {
        triggerToast('Could not reach Supabase. Click the Supabase badge in the header.');
      }
    } catch {
      triggerToast('Error connecting to Supabase.');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSearchSubmit = (params: {
    fromCode: string;
    toCode: string;
    journeyDate: string;
  }) => {
    setFromCode(params.fromCode);
    setToCode(params.toCode);
    setJourneyDate(params.journeyDate);
    setBookingTrain(null);
    setActiveTab('search');
  };

  const fromStation = STATIONS.find((s) => s.code === fromCode);
  const toStation = STATIONS.find((s) => s.code === toCode);
  const availableTrains = getTrainsForRoute(fromCode, toCode);

  const handleSelectTrainForBooking = (train: Train, classCode: string) => {
    const classInfo = train.classes[classCode];
    const coachCode = classInfo ? classInfo.coachCode : 'B1';

    setBookingTrain(train);
    setBookingClassCode(classCode);
    setPassengers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        assignedCoach: coachCode,
        assignedSeat: `${21 + idx}`,
        assignedBerthType: p.berthPreference === 'No Preference' ? 'Lower' : p.berthPreference,
      }))
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    const coachCode = bookingTrain?.classes[bookingClassCode]?.coachCode || 'B2';
    setPassengers((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        fullName: '',
        age: 26,
        gender: 'female',
        berthPreference: 'No Preference',
        foodChoice: 'Veg',
        assignedCoach: coachCode,
        assignedSeat: `${21 + prev.length}`,
        assignedBerthType: 'Window',
      },
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePassenger = (id: string, field: keyof Passenger, value: any) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleUpdatePassengerSeat = (passengerId: string, seatNumber: string, berthType: string) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId
          ? {
              ...p,
              assignedSeat: seatNumber,
              assignedBerthType: berthType,
            }
          : p
      )
    );
  };

  const handleConfirmBooking = (paymentMethod: string) => {
    if (!bookingTrain) return;

    const newPnr = generatePnr();
    const classInfo = bookingTrain.classes[bookingClassCode];
    const baseFare = (classInfo?.basePrice || 1200) * passengers.length;
    const fees = Math.round(baseFare * 0.05) + 40 * passengers.length;
    const totalFare = baseFare + fees;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      pnr: newPnr,
      trainNumber: bookingTrain.number,
      trainName: bookingTrain.name,
      trainType: bookingTrain.type,
      originCode: bookingTrain.origin.code,
      originName: bookingTrain.origin.name,
      destinationCode: bookingTrain.destination.code,
      destinationName: bookingTrain.destination.name,
      journeyDate,
      departureTime: bookingTrain.departureTime,
      arrivalTime: bookingTrain.arrivalTime,
      duration: bookingTrain.duration,
      classCode: bookingClassCode,
      className: `${bookingClassCode} Class`,
      quota: 'General Quota',
      passengers,
      contactEmail,
      contactPhone,
      baseFare,
      reservationFee: 40 * passengers.length,
      tax: Math.round(baseFare * 0.05),
      insuranceFee: 0,
      totalFare,
      paymentMethod,
      transactionId: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
      platformNumber: bookingTrain.stops[0]?.platform || 1,
    };

    saveBooking(newBooking);
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);
    setBookingTrain(null);
    setActiveETicket(newBooking);
    triggerToast(`Ticket booked! PNR: ${newPnr}`);

    // Automatically generate and dispatch e-ticket document to registered email and mobile
    deliverTicketToUser(newBooking, {
      toEmail: !!newBooking.contactEmail,
      toMobile: !!newBooking.contactPhone,
      autoDownloadPdf: false,
    }).then((delRes) => {
      if (delRes.pdfGenerated) {
        triggerToast(`E-Ticket document (PDF) issued & sent to ${newBooking.contactEmail} and +91-${newBooking.contactPhone}!`);
      }
    });

    // Asynchronously insert booking into Supabase so data is visible in the dashboard
    saveBookingToSupabase(newBooking).then((result) => {
      if (result.success) {
        triggerToast(`Ticket booked & stored in Supabase! PNR: ${newPnr}`);
      } else {
        console.warn('[Supabase] Save notice:', result.error);
        if (result.error?.includes('schema cache') || result.error?.includes('bookings')) {
          triggerToast(`Booked locally. To sync with Supabase: click the Supabase badge in the header to run the SQL table script.`);
        } else {
          triggerToast(`Booked locally (Supabase note: ${result.error})`);
        }
      }
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    const updated = updateBooking(bookingId, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    });
    if (updated) {
      setBookings(getStoredBookings());
      if (activeETicket && activeETicket.id === bookingId) {
        setActiveETicket(updated);
      }

      // Update in Supabase
      updateBookingInSupabase(bookingId, {
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
      }).then((res) => {
        if (res.success) {
          triggerToast('Booking cancelled & updated in Supabase.');
        } else {
          triggerToast('Booking cancelled locally.');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setBookingTrain(null);
        }}
        bookingCount={bookings.filter((b) => b.status === 'CONFIRMED').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* TAB 1: BOOK TICKETS */}
        {activeTab === 'search' && (
          <>
            {bookingTrain ? (
              <SimpleBookingForm
                train={bookingTrain}
                classCode={bookingClassCode}
                journeyDate={journeyDate}
                passengers={passengers}
                contactEmail={contactEmail}
                contactPhone={contactPhone}
                onAddPassenger={handleAddPassenger}
                onRemovePassenger={handleRemovePassenger}
                onUpdatePassenger={handleUpdatePassenger}
                onUpdatePassengerSeat={handleUpdatePassengerSeat}
                onChangeContactEmail={setContactEmail}
                onChangeContactPhone={setContactPhone}
                onBack={() => setBookingTrain(null)}
                onConfirmBooking={handleConfirmBooking}
              />
            ) : (
              <div className="space-y-5">
                <TrainSearchWidget
                  fromCode={fromCode}
                  toCode={toCode}
                  journeyDate={journeyDate}
                  onSearch={handleSearchSubmit}
                />

                <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
                  <span>
                    Trains from <strong className="text-slate-900">{fromStation?.city || fromCode}</strong> to <strong className="text-slate-900">{toStation?.city || toCode}</strong> ({availableTrains.length} trains found)
                  </span>
                  <span>Date: {journeyDate}</span>
                </div>

                <div className="space-y-3">
                  {availableTrains.map((train) => (
                    <TrainCard
                      key={train.id}
                      train={train}
                      onOpenSchedule={(t) => setScheduleModalTrain(t)}
                      onSelectTrainForBooking={handleSelectTrainForBooking}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: CHECK PNR */}
        {activeTab === 'pnr' && (
          <PNRStatusView
            bookings={bookings}
            onOpenETicket={(b) => setActiveETicket(b)}
            onBookingFound={(b) => {
              setBookings((prev) => [b, ...prev.filter((item) => item.id !== b.id)]);
              triggerToast(`Loaded PNR ${b.pnr} from Supabase database!`);
            }}
          />
        )}

        {/* TAB 3: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onOpenETicket={(b) => setActiveETicket(b)}
            onCancelBooking={handleCancelBooking}
            onStartBooking={() => setActiveTab('search')}
            onRefreshBookings={handleRefreshSupabaseBookings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>RailTicket · Simple & Fast Railway Reservations</p>
      </footer>

      {/* Stops Schedule Modal */}
      {scheduleModalTrain && (
        <TrainScheduleModal
          train={scheduleModalTrain}
          onClose={() => setScheduleModalTrain(null)}
        />
      )}

      {/* Printable E-Ticket Modal */}
      {activeETicket && (
        <ETicketModal
          booking={activeETicket}
          onClose={() => setActiveETicket(null)}
          onCancelTicket={handleCancelBooking}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Passenger, Train } from '../types/railway';
import { Plus, Trash2, ArrowLeft, CheckCircle2, Armchair, Mail, Smartphone, FileText } from 'lucide-react';
import { CoachSeatSelector } from './CoachSeatSelector';

interface SimpleBookingFormProps {
  train: Train;
  classCode: string;
  journeyDate: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  onAddPassenger: () => void;
  onRemovePassenger: (id: string) => void;
  onUpdatePassenger: (id: string, field: keyof Passenger, value: any) => void;
  onUpdatePassengerSeat: (passengerId: string, seatNumber: string, berthType: string) => void;
  onChangeContactEmail: (email: string) => void;
  onChangeContactPhone: (phone: string) => void;
  onBack: () => void;
  onConfirmBooking: (paymentMethod: string) => void;
}

export const SimpleBookingForm: React.FC<SimpleBookingFormProps> = ({
  train,
  classCode,
  journeyDate,
  passengers,
  contactEmail,
  contactPhone,
  onAddPassenger,
  onRemovePassenger,
  onUpdatePassenger,
  onUpdatePassengerSeat,
  onChangeContactEmail,
  onChangeContactPhone,
  onBack,
  onConfirmBooking,
}) => {
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [sendToEmail, setSendToEmail] = useState(true);
  const [sendToMobile, setSendToMobile] = useState(true);

  const classData = train.classes[classCode] || Object.values(train.classes)[0];
  const basePrice = classData ? classData.basePrice : 1200;
  const numPassengers = passengers.length;
  const subtotal = basePrice * numPassengers;
  const taxesAndFees = Math.round(subtotal * 0.05) + (40 * numPassengers);
  const grandTotal = subtotal + taxesAndFees;

  const isFormValid =
    passengers.every((p) => p.fullName.trim().length > 1 && p.age > 0) &&
    contactEmail.includes('@') &&
    contactPhone.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onConfirmBooking(paymentMode === 'upi' ? `UPI (${upiId})` : 'Credit/Debit Card');
  };

  const isChairCar = ['CC', 'EC'].includes(classCode);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top bar with back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Train Results</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          Step 2 of 2: Passenger Details & Payment
        </span>
      </div>

      {/* Train Info Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded">
                #{train.number}
              </span>
              <span className="font-bold text-base">{train.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Class: <span className="text-white font-semibold">{classCode}</span> · Date: <span className="text-white font-semibold">{journeyDate}</span>
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Departure</span>
            <span className="font-bold text-white text-sm">{train.departureTime}</span>
            <span className="text-slate-400 block">{train.origin.city} ({train.origin.code})</span>
          </div>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Destination: <strong className="text-white">{train.destination.city} ({train.destination.code})</strong></span>
          <span>Arrival: <strong className="text-white">{train.arrivalTime}</strong></span>
          <span>Duration: <strong className="text-white">{train.duration}</strong></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Passenger Information Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Passenger Details
            </h3>
            {passengers.length < 4 && (
              <button
                type="button"
                onClick={onAddPassenger}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Passenger</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {passengers.map((p, idx) => (
              <div
                key={p.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Passenger {idx + 1}
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemovePassenger(p.id)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={p.fullName}
                      onChange={(e) => onUpdatePassenger(p.id, 'fullName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="119"
                      placeholder="Age"
                      value={p.age || ''}
                      onChange={(e) =>
                        onUpdatePassenger(p.id, 'age', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Gender
                    </label>
                    <select
                      value={p.gender}
                      onChange={(e) => onUpdatePassenger(p.id, 'gender', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Berth Preference
                    </label>
                    <select
                      value={p.berthPreference}
                      onChange={(e) => onUpdatePassenger(p.id, 'berthPreference', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
                    >
                      <option value="No Preference">No Preference</option>
                      {isChairCar ? (
                        <>
                          <option value="Window">Window Seat</option>
                          <option value="Aisle">Aisle Seat</option>
                        </>
                      ) : (
                        <>
                          <option value="Lower">Lower Berth</option>
                          <option value="Middle">Middle Berth</option>
                          <option value="Upper">Upper Berth</option>
                          <option value="Side Lower">Side Lower</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Seat Selector toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSeatMap(!showSeatMap)}
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Armchair className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {showSeatMap ? 'Hide Coach Layout' : 'Choose Specific Seat on Coach Map (Optional)'}
              </span>
            </button>

            {showSeatMap && (
              <div className="mt-3">
                <CoachSeatSelector
                  classCode={classCode}
                  coachCode={classData?.coachCode || 'B2'}
                  passengers={passengers}
                  onUpdatePassengerSeat={onUpdatePassengerSeat}
                />
              </div>
            )}
          </div>
        </div>

        {/* Contact Information & E-Ticket Delivery Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Contact & E-Ticket Document Delivery</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Auto PDF Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered Email Address *</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => onChangeContactEmail(e.target.value)}
                placeholder="traveler@email.com"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered Mobile Number *</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => onChangeContactPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          {/* Delivery Channel Options */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Send E-Ticket Document (PDF & Reservation Slip) to:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToEmail}
                  onChange={(e) => setSendToEmail(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Registered Email</span>
                  <span className="text-[11px] text-slate-500">Official PDF E-Ticket document attachment</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToMobile}
                  onChange={(e) => setSendToMobile(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Registered Mobile No</span>
                  <span className="text-[11px] text-slate-500">Instant SMS & WhatsApp reservation slip</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Simple Payment & Confirmation Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Payment Method & Confirmation
          </h3>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMode('upi')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                paymentMode === 'upi'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              UPI (Instant)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('card')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                paymentMode === 'card'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Debit / Credit Card
            </button>
          </div>

          {paymentMode === 'upi' ? (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Enter UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Expiry / CVV
                </label>
                <input
                  type="text"
                  defaultValue="12/28 · 821"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-medium text-slate-900 font-mono"
                />
              </div>
            </div>
          )}

          {/* Fare Summary & CTA */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Total Fare to Pay</span>
              <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                ₹{grandTotal}
              </div>
              <span className="text-[11px] text-slate-400">
                ({numPassengers} passenger{numPassengers > 1 ? 's' : ''}, includes GST & fees)
              </span>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Confirm & Book Ticket
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

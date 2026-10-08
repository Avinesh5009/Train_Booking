import React, { useState } from 'react';
import { X, CreditCard, QrCode, Building, CheckCircle2, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Train, Passenger } from '../types/railway';

interface CheckoutPaymentModalProps {
  train: Train;
  classCode: string;
  quota: string;
  journeyDate: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  insuranceOptIn: boolean;
  onClose: () => void;
  onSuccess: (paymentDetails: {
    paymentMethod: string;
    transactionId: string;
    baseFare: number;
    reservationFee: number;
    tax: number;
    insuranceFee: number;
    totalFare: number;
  }) => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  train,
  classCode,
  quota,
  journeyDate,
  passengers,
  contactEmail,
  contactPhone,
  insuranceOptIn,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('921');
  const [cardName, setCardName] = useState(passengers[0]?.fullName || 'Card Holder');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const classAvailability = train.classes[classCode];
  const basePricePerPerson = classAvailability ? classAvailability.basePrice : 1200;
  const numPassengers = passengers.length;
  const subtotalBase = basePricePerPerson * numPassengers;
  const reservationFee = 40 * numPassengers;
  const superfastCharge = 45 * numPassengers;
  const insuranceFee = insuranceOptIn ? 15 * numPassengers : 0;
  const taxableSum = subtotalBase + reservationFee + superfastCharge;
  const tax = Math.round(taxableSum * 0.05); // 5% GST
  const grandTotal = taxableSum + tax + insuranceFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const paymentMethodName =
        activeTab === 'upi'
          ? `UPI (${upiId})`
          : activeTab === 'card'
          ? `Card (Ending in 4242)`
          : `Net Banking (${selectedBank})`;

      const randomTxn = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      onSuccess({
        paymentMethod: paymentMethodName,
        transactionId: randomTxn,
        baseFare: subtotalBase,
        reservationFee: reservationFee + superfastCharge,
        tax,
        insuranceFee,
        totalFare: grandTotal,
      });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Review & Complete Payment
              </h3>
              <p className="text-xs text-slate-500">
                256-Bit Encrypted Secure Railway Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Fare Breakdown & Trip Summary */}
          <div className="md:col-span-6 space-y-4">
            {/* Trip brief */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span>{train.name} (#{train.number})</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {classCode} · {quota}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Route</span>
                <span className="font-semibold text-slate-800">
                  {train.origin.city} ({train.origin.code}) → {train.destination.city} ({train.destination.code})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Date & Time</span>
                <span className="font-semibold text-slate-800">
                  {journeyDate} · {train.departureTime}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Passengers ({numPassengers})</span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">
                  {passengers.map((p) => p.fullName || 'Traveler').join(', ')}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Fare Breakdown
              </h4>

              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({numPassengers} × ₹{basePricePerPerson})</span>
                <span className="font-mono tabular-nums text-slate-900">₹{subtotalBase}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Reservation & Superfast Surcharge</span>
                <span className="font-mono tabular-nums text-slate-900">
                  ₹{reservationFee + superfastCharge}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Goods & Service Tax (5% GST)</span>
                <span className="font-mono tabular-nums text-slate-900">₹{tax}</span>
              </div>

              {insuranceOptIn && (
                <div className="flex justify-between text-slate-600">
                  <span>Travel Insurance</span>
                  <span className="font-mono tabular-nums text-slate-900">₹{insuranceFee}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900 text-sm">
                <span>Total Amount Payable</span>
                <span className="font-mono text-xl text-emerald-800 tabular-nums">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Full refund guarantee if train cancelled by railways. Free cancellation allowed until charting.
              </span>
            </div>
          </div>

          {/* Right Column: Payment Methods */}
          <div className="md:col-span-6 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Choose Payment Method
            </h4>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'upi'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-4 h-4 text-emerald-700" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Payment form */}
            <form onSubmit={handlePay} className="space-y-4 pt-1">
              {activeTab === 'upi' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">
                      Instant UPI Transfer
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                      required
                    />
                  </div>

                  {/* QR Code Graphic Simulation */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-white flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-900 p-1.5 rounded flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-white rounded-xs grid grid-cols-4 gap-0.5 p-1">
                        <div className="bg-black" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                        <div className="bg-black" />
                        <div className="bg-black" />
                        <div className="bg-black" />
                        <div className="bg-white" />
                        <div className="bg-black" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 block">
                        Scan with any UPI App
                      </span>
                      Google Pay, PhonePe, Paytm, BHIM, Cred
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'card' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    You will be securely routed to your bank's portal to authorize ₹{grandTotal}.
                  </p>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Ticket with Railway Central PRS...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{grandTotal} & Generate Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

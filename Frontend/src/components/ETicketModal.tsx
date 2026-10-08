import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Train,
  AlertCircle,
  Mail,
  Smartphone,
  Send,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Booking } from '../types/railway';
import { downloadTicketPDF } from '../services/pdfTicketGenerator';
import {
  sendTicketToEmail,
  sendTicketToMobile,
} from '../services/ticketNotificationService';

interface ETicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelTicket?: (bookingId: string) => void;
  onCheckLiveStatus?: (trainNumber: string) => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({
  booking,
  onClose,
  onCancelTicket,
  onCheckLiveStatus,
}) => {
  if (!booking) return null;

  const [emailStatus, setEmailStatus] = useState<string | null>(
    `Dispatched to ${booking.contactEmail}`
  );
  const [mobileStatus, setMobileStatus] = useState<string | null>(
    `SMS summary dispatched to +91-${booking.contactPhone}`
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingMobile, setIsSendingMobile] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadTicketPDF(booking);
  };

  const handleSendEmail = () => {
    setIsSendingEmail(true);
    const result = sendTicketToEmail(booking);
    if (result.success && result.mailtoUrl) {
      window.open(result.mailtoUrl, '_blank');
      setEmailStatus(`Sent to ${booking.contactEmail}`);
    } else {
      setEmailStatus(result.message);
    }
    setTimeout(() => setIsSendingEmail(false), 600);
  };

  const handleSendMobile = (channel: 'whatsapp' | 'sms' = 'whatsapp') => {
    setIsSendingMobile(true);
    const result = sendTicketToMobile(booking, channel);
    setMobileStatus(`Dispatched via ${channel.toUpperCase()} to +91-${booking.contactPhone}`);
    setTimeout(() => setIsSendingMobile(false), 600);
  };

  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                isCancelled
                  ? 'bg-red-100 text-red-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isCancelled ? 'CANCELLED / REFUND PROCESSED' : 'TICKET CONFIRMED'}
            </span>
            <span className="text-xs text-slate-500">
              PNR: <strong className="font-mono text-slate-800">{booking.pnr}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF E-Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-Ticket Document Dispatch Notification Banner */}
        <div className="no-print bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>E-Ticket Document issued:</strong> Dispatched to registered email & mobile.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Resend to registered email"
            >
              <Mail className="w-3 h-3 text-emerald-600" />
              <span>{emailStatus ? 'Email Sent' : 'Send to Email'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMobile('whatsapp')}
              disabled={isSendingMobile}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Send to registered WhatsApp mobile"
            >
              <Smartphone className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp / SMS</span>
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-slate-100/50">
          <div
            id="printable-ticket"
            className="bg-white rounded-xl border border-slate-300 p-5 sm:p-7 shadow-xs space-y-6"
          >
            {/* Ticket Header & Seal */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold">
                  <Train className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    RAIL EXPRESS · ELECTRONIC RESERVATION SLIP
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    National Railway Ticketing Corporation · Passenger Reservation System
                  </p>
                </div>
              </div>

              {/* PNR Stamp */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  10-DIGIT PNR NUMBER
                </span>
                <span className="font-mono text-xl font-black text-slate-900 tracking-wider">
                  {booking.pnr}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  STATUS: {booking.status}
                </span>
              </div>
            </div>

            {/* Train & Journey Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Train Name & Number</span>
                <strong className="text-slate-900 block font-bold text-sm">
                  #{booking.trainNumber} {booking.trainName}
                </strong>
                <span className="text-slate-500 text-[11px]">{booking.trainType}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Class & Quota</span>
                <strong className="text-slate-900 block font-bold text-sm">
                  {booking.classCode} ({booking.className})
                </strong>
                <span className="text-slate-500 text-[11px]">{booking.quota}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Journey Date</span>
                <strong className="text-slate-900 block font-bold text-sm font-mono">
                  {booking.journeyDate}
                </strong>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  Platform {booking.platformNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Transaction Reference</span>
                <strong className="text-slate-900 block font-mono text-[11px] truncate">
                  {booking.transactionId}
                </strong>
                <span className="text-slate-400 text-[10px]">
                  {new Date(booking.bookedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Route Stations Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-200 rounded-lg p-4 bg-white">
              <div className="border-r-0 sm:border-r border-slate-200 sm:pr-4">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                  BOARDING / ORIGIN
                </span>
                <div className="font-bold text-base text-slate-900">
                  {booking.originName} ({booking.originCode})
                </div>
                <div className="font-mono text-sm font-bold text-emerald-800 mt-1">
                  Scheduled Departure: {booking.departureTime}
                </div>
              </div>

              <div className="sm:pl-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                  DESTINATION
                </span>
                <div className="font-bold text-base text-slate-900">
                  {booking.destinationName} ({booking.destinationCode})
                </div>
                <div className="font-mono text-sm font-bold text-slate-800 mt-1">
                  Scheduled Arrival: {booking.arrivalTime} ({booking.duration})
                </div>
              </div>
            </div>

            {/* Passenger Manifest Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Passenger Details & Assigned Berths
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Passenger Name</th>
                      <th className="py-2.5 px-3 font-semibold">Age / Gender</th>
                      <th className="py-2.5 px-3 font-semibold">Coach</th>
                      <th className="py-2.5 px-3 font-semibold">Berth / Seat</th>
                      <th className="py-2.5 px-3 font-semibold">Berth Type</th>
                      <th className="py-2.5 px-3 font-semibold">Meal</th>
                      <th className="py-2.5 px-3 font-semibold">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {booking.passengers.map((p, index) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono">{index + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {p.fullName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">
                          {p.age} / {p.gender.toUpperCase()}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {p.assignedCoach || 'B1'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                          {p.assignedSeat || '21'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {p.assignedBerthType || p.berthPreference}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {p.foodChoice}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`font-semibold ${
                              isCancelled ? 'text-red-700' : 'text-emerald-700'
                            }`}
                          >
                            {isCancelled ? 'CNF (Cancelled)' : 'CNF (Confirmed)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Section: QR Code & Fare Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4 border-t border-slate-200 items-center">
              {/* QR Code Graphic Representation */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className="w-20 h-20 bg-slate-900 p-2 rounded-lg shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white grid grid-cols-5 gap-0.5 p-1">
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800 block">PRS Digital Verification</span>
                  Scan by TTE on board. Official digital signature valid without physical print.
                </div>
              </div>

              {/* Total Fare box */}
              <div className="sm:col-span-8 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex justify-between items-center text-slate-600 mb-1">
                  <span>Payment Gateway: {booking.paymentMethod}</span>
                  <span>Contact: {booking.contactPhone}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Total Fare Paid (Inclusive of Taxes):</span>
                  <span className="font-mono text-xl font-black text-slate-900 tabular-nums">
                    ₹{booking.totalFare}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Contact E-Ticket Dispatch Details */}
            <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>E-Ticket Document Delivery Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800 pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Email: <strong>{booking.contactEmail}</strong> (Official E-Ticket document attached)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Mobile: <strong>+91-{booking.contactPhone}</strong> (SMS & WhatsApp reservation link)
                  </span>
                </div>
              </div>
            </div>

            {/* Travel Guidelines */}
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Important Travel Instructions:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                <li>One passenger must present a valid government-issued photo identity proof (Aadhaar, Passport, Driving License, Voter ID).</li>
                <li>Please arrive at the platform at least 20 minutes before scheduled departure time.</li>
                <li>Free cancellation available until 4 hours before scheduled departure.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden on print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {onCheckLiveStatus && (
              <button
                type="button"
                onClick={() => onCheckLiveStatus(booking.trainNumber)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Track Live Train Running Status
              </button>
            )}

            {!isCancelled && onCancelTicket && (
              <button
                type="button"
                onClick={() => onCancelTicket(booking.id)}
                className="px-3 py-1.5 text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel Ticket & Request Refund
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

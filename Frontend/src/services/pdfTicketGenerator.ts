import { jsPDF } from 'jspdf';
import { Booking } from '../types/railway';

/**
 * Generates an official Railway Electronic Reservation Slip (ERS) in PDF format
 */
export function generateTicketPDF(booking: Booking): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // Header Background Banner
  doc.setFillColor(15, 118, 110); // Emerald 700
  doc.rect(margin, y, contentWidth, 22, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('INDIAN RAILWAYS · ELECTRONIC RESERVATION SLIP (ERS)', margin + 4, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('National Passenger Reservation System · RailExpress Digital Ticketing', margin + 4, y + 16);

  y += 26;

  // PNR and Booking Status Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('10-DIGIT PNR NUMBER:', margin + 4, y + 7);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.setFont('courier', 'bold');
  doc.text(booking.pnr, margin + 4, y + 14);

  // Status Badge on Right
  const isCancelled = booking.status === 'CANCELLED';
  if (isCancelled) {
    doc.setFillColor(254, 226, 226);
    doc.setTextColor(185, 28, 28);
  } else {
    doc.setFillColor(209, 250, 229);
    doc.setTextColor(6, 95, 70);
  }
  doc.roundedRect(pageWidth - margin - 46, y + 4, 42, 10, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isCancelled ? 'CANCELLED' : 'CONFIRMED (CNF)', pageWidth - margin - 44, y + 10.5);

  y += 22;

  // Journey Details Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('JOURNEY & TRAIN PARTICULARS', margin + 3, y + 5);

  y += 8;

  // Grid for Journey Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  const col1 = margin + 3;
  const col2 = margin + (contentWidth / 4) + 2;
  const col3 = margin + (contentWidth / 2) + 2;
  const col4 = margin + ((contentWidth * 3) / 4) + 2;

  doc.text('Train Name & No.:', col1, y + 4);
  doc.text('Class & Quota:', col2, y + 4);
  doc.text('Journey Date:', col3, y + 4);
  doc.text('Transaction ID:', col4, y + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${booking.trainNumber} - ${booking.trainName}`, col1, y + 10);
  doc.text(`${booking.classCode} (${booking.quota})`, col2, y + 10);
  doc.text(`${booking.journeyDate}`, col3, y + 10);
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.text(booking.transactionId || 'N/A', col4, y + 10);

  y += 14;

  // Route / Origin & Destination Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110);
  doc.text('ORIGIN / BOARDING:', col1, y + 5.5);
  doc.text('DESTINATION:', col3, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${booking.originName} (${booking.originCode})`, col1, y + 11);
  doc.text(`${booking.destinationName} (${booking.destinationCode})`, col3, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Dept: ${booking.departureTime} | Platform: ${booking.platformNumber || 1}`, col1, y + 15);
  doc.text(`Arr: ${booking.arrivalTime} | Duration: ${booking.duration}`, col3, y + 15);

  y += 20;

  // Passenger Manifest Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('PASSENGER DETAILS & ASSIGNED BERTHS', margin + 3, y + 5);

  y += 8;

  // Table Columns Header
  const pCols = [
    { name: '#', x: margin + 3, w: 8 },
    { name: 'Passenger Name', x: margin + 12, w: 55 },
    { name: 'Age/Sex', x: margin + 70, w: 22 },
    { name: 'Coach', x: margin + 95, w: 18 },
    { name: 'Berth/Seat', x: margin + 116, w: 25 },
    { name: 'Berth Type', x: margin + 144, w: 26 },
    { name: 'Status', x: margin + 172, w: 18 },
  ];

  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  pCols.forEach((col) => {
    doc.text(col.name, col.x, y + 4.2);
  });

  y += 6.5;

  // Passenger Rows
  booking.passengers.forEach((p, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    doc.text(String(index + 1), pCols[0].x, y + 4.8);
    doc.setFont('helvetica', 'bold');
    doc.text(p.fullName || 'Passenger', pCols[1].x, y + 4.8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${p.age} / ${p.gender.toUpperCase().slice(0, 1)}`, pCols[2].x, y + 4.8);

    doc.setFont('courier', 'bold');
    doc.text(p.assignedCoach || 'B1', pCols[3].x, y + 4.8);
    doc.text(p.assignedSeat || `${20 + index}`, pCols[4].x, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.text(p.assignedBerthType || p.berthPreference || 'Window', pCols[5].x, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 118, 110);
    doc.text(isCancelled ? 'CAN' : 'CNF', pCols[6].x, y + 4.8);

    y += 7.2;
  });

  y += 4;

  // Fare & Payment Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('FARE & PAYMENT BREAKDOWN', margin + 3, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Base Fare: ₹${booking.baseFare}`, margin + 3, y + 11);
  doc.text(`Reservation & Superfast Fee: ₹${booking.reservationFee}`, margin + 3, y + 16);
  doc.text(`GST & Service Tax: ₹${booking.tax}`, margin + 3, y + 21);

  const rightCol = margin + (contentWidth / 2);
  doc.text(`Travel Insurance: ₹${booking.insuranceFee || 0}`, rightCol, y + 11);
  doc.text(`Payment Mode: ${booking.paymentMethod || 'Online'}`, rightCol, y + 16);

  // Total Fare Highlight
  doc.setFillColor(15, 118, 110);
  doc.roundedRect(pageWidth - margin - 52, y + 4, 48, 18, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TOTAL AMOUNT PAID', pageWidth - margin - 50, y + 9);
  doc.setFontSize(13);
  doc.text(`₹${booking.totalFare}`, pageWidth - margin - 50, y + 17);

  y += 30;

  // Contact Details & E-Ticket Notification Dispatch Stamp
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110);
  doc.text('E-TICKET DISPATCH NOTICE:', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(19, 78, 74);
  doc.text(
    `Official E-Ticket document dispatched to Registered Email: ${booking.contactEmail} & Mobile: +91-${booking.contactPhone}`,
    margin + 3,
    y + 10
  );

  y += 18;

  // Important Terms and Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('IMPORTANT TRAVEL GUIDELINES:', margin, y);

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  const instructions = [
    '1. Valid Photo ID: One passenger must carry original Government ID (Aadhaar, Passport, Driving License, Voter ID).',
    '2. Electronic Slip (ERS): This digital PDF is legally valid under Indian Railways rules; physical printout is optional.',
    '3. Reporting Time: Passengers are advised to reach the departure platform at least 20 minutes before departure.',
    '4. Cancellation Policy: Tickets can be cancelled online up to 4 hours before scheduled train departure.',
  ];

  instructions.forEach((ins) => {
    doc.text(ins, margin, y);
    y += 4;
  });

  // Footer bar
  y = doc.internal.pageSize.getHeight() - 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('National Passenger Reservation System (PRS) · Generated automatically by RailTicket Express Cloud System', margin, y + 2);
  doc.text(`Page 1 of 1 · Generated on ${new Date().toLocaleString()}`, pageWidth - margin - 45, y + 2);

  return doc;
}

/**
 * Downloads the E-Ticket directly as a formatted PDF file
 */
export function downloadTicketPDF(booking: Booking): void {
  const doc = generateTicketPDF(booking);
  doc.save(`RailExpress-ETicket-${booking.pnr}.pdf`);
}

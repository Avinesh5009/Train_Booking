import React, { useState, useId } from 'react';
import { Passenger } from '../types/railway';
import { UserCheck, Armchair, HelpCircle } from 'lucide-react';

interface CoachSeatSelectorProps {
  classCode: string;
  coachCode: string;
  passengers: Passenger[];
  onUpdatePassengerSeat: (passengerId: string, seatNumber: string, berthType: string) => void;
}

interface SeatModel {
  number: number;
  label: string;
  berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle';
  isBooked: boolean;
}

export const CoachSeatSelector: React.FC<CoachSeatSelectorProps> = ({
  classCode,
  coachCode,
  passengers,
  onUpdatePassengerSeat,
}) => {
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

  // Generate realistic coach layout based on class type
  const isChairCar = ['CC', 'EC'].includes(classCode);

  // Pre-generate deterministic seats
  const totalSeats = isChairCar ? 40 : 32;
  const seats: SeatModel[] = Array.from({ length: totalSeats }, (_, i) => {
    const seatNum = i + 1;
    // Deterministically mark some seats as already booked
    const isBooked = [3, 4, 8, 11, 12, 17, 21, 22, 29].includes(seatNum);

    if (isChairCar) {
      // 2x2 or 3x2 rows
      const mod = seatNum % 4;
      const berthType = mod === 1 || mod === 0 ? 'Window' : 'Aisle';
      return {
        number: seatNum,
        label: `${seatNum}`,
        berthType,
        isBooked,
      };
    } else {
      // Sleeper / 3A berth layout logic (groups of 8)
      const mod = seatNum % 8;
      let berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper';
      if (mod === 1 || mod === 4) berthType = 'Lower';
      else if (mod === 2 || mod === 5) berthType = 'Middle';
      else if (mod === 3 || mod === 6) berthType = 'Upper';
      else if (mod === 7) berthType = 'Side Lower';
      else berthType = 'Side Upper';

      return {
        number: seatNum,
        label: `${seatNum} (${berthType.slice(0, 2).toUpperCase()})`,
        berthType,
        isBooked,
      };
    }
  });

  const getSeatAssignedToPassenger = (seatNumStr: string) => {
    return passengers.find((p) => p.assignedSeat === seatNumStr);
  };

  const handleSeatClick = (seat: SeatModel) => {
    if (seat.isBooked) return;

    const currentPassenger = passengers[activePassengerIndex];
    if (!currentPassenger) return;

    // Check if another passenger already has this seat
    const existingPassenger = getSeatAssignedToPassenger(String(seat.number));
    if (existingPassenger && existingPassenger.id !== currentPassenger.id) {
      // Release it from previous
      onUpdatePassengerSeat(existingPassenger.id, '', '');
    }

    // Toggle seat for active passenger
    if (currentPassenger.assignedSeat === String(seat.number)) {
      onUpdatePassengerSeat(currentPassenger.id, '', '');
    } else {
      onUpdatePassengerSeat(currentPassenger.id, String(seat.number), seat.berthType);
      // Auto advance to next unassigned passenger if any
      const nextUnassigned = passengers.findIndex(
        (p, idx) => idx > activePassengerIndex && !p.assignedSeat
      );
      if (nextUnassigned !== -1) {
        setActivePassengerIndex(nextUnassigned);
      }
    }
  };

  const autoAssignRemainingSeats = () => {
    let seatIndex = 0;
    passengers.forEach((passenger) => {
      if (!passenger.assignedSeat) {
        while (seatIndex < seats.length) {
          const seat = seats[seatIndex];
          seatIndex++;
          const alreadyTaken = passengers.some((p) => p.assignedSeat === String(seat.number));
          if (!seat.isBooked && !alreadyTaken) {
            onUpdatePassengerSeat(passenger.id, String(seat.number), seat.berthType);
            break;
          }
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Armchair className="w-4 h-4 text-emerald-700" />
            <span>Interactive Coach Layout: Coach {coachCode} ({classCode})</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Click seats to assign berths for each traveler or use quick auto-assignment.
          </p>
        </div>

        <button
          type="button"
          onClick={autoAssignRemainingSeats}
          className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
        >
          Auto-Assign Best Berths
        </button>
      </div>

      {/* Passenger selector tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg mb-4 overflow-x-auto">
        <span className="text-xs font-medium text-slate-500 pl-2 shrink-0">Selecting for:</span>
        {passengers.map((p, idx) => {
          const isSelected = activePassengerIndex === idx;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePassengerIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{p.fullName || `Passenger ${idx + 1}`}</span>
              {p.assignedSeat ? (
                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  Seat {p.assignedSeat}
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1 rounded">
                  Select
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Coach Container */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
        {/* Coach header details */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-3 mb-3 border-b border-slate-200">
          <span className="font-bold text-slate-700 font-mono">◄ ENTRY / VESTIBULE</span>
          <span className="font-bold text-slate-700 font-mono">COACH {coachCode}</span>
          <span className="font-bold text-slate-700 font-mono">TOILET / PANTRY ►</span>
        </div>

        {/* Sleeper / Berths Visualizer */}
        {!isChairCar ? (
          <div className="space-y-4 min-w-[560px]">
            {/* Render bays of 8 berths */}
            {Array.from({ length: totalSeats / 8 }).map((_, bayIdx) => {
              const bayStart = bayIdx * 8;
              const baySeats = seats.slice(bayStart, bayStart + 8);

              // Standard Indian Rail sleeper bay:
              // Left column: 1 (LB), 2 (MB), 3 (UB)
              // Right column: 4 (LB), 5 (MB), 6 (UB)
              // Corridor / Aisle
              // Side column: 7 (SL), 8 (SU)
              const leftMain = [baySeats[0], baySeats[1], baySeats[2]];
              const rightMain = [baySeats[3], baySeats[4], baySeats[5]];
              const sideBerths = [baySeats[6], baySeats[7]];

              return (
                <div
                  key={bayIdx}
                  className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase w-12">
                    Bay {bayIdx + 1}
                  </div>

                  {/* Main Compartment: Left & Right berths */}
                  <div className="flex items-center gap-2">
                    {/* Left stack */}
                    <div className="flex flex-col gap-1.5">
                      {leftMain.map((seat) => (
                        <SeatButton
                          key={seat.number}
                          seat={seat}
                          passengers={passengers}
                          activePassengerIndex={activePassengerIndex}
                          onClick={() => handleSeatClick(seat)}
                        />
                      ))}
                    </div>

                    <div className="w-4 flex justify-center text-[10px] text-slate-300 font-mono">
                      |
                    </div>

                    {/* Right stack */}
                    <div className="flex flex-col gap-1.5">
                      {rightMain.map((seat) => (
                        <SeatButton
                          key={seat.number}
                          seat={seat}
                          passengers={passengers}
                          activePassengerIndex={activePassengerIndex}
                          onClick={() => handleSeatClick(seat)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Aisle Spacer */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                      ── AISLE ──
                    </span>
                  </div>

                  {/* Side Berths */}
                  <div className="flex flex-col gap-1.5">
                    {sideBerths.map((seat) => (
                      <SeatButton
                        key={seat.number}
                        seat={seat}
                        passengers={passengers}
                        activePassengerIndex={activePassengerIndex}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Chair Car Layout: 2 x 2 seating */
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 min-w-[560px]">
            {seats.map((seat) => (
              <SeatButton
                key={seat.number}
                seat={seat}
                passengers={passengers}
                activePassengerIndex={activePassengerIndex}
                onClick={() => handleSeatClick(seat)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-700 text-white font-mono text-[9px] flex items-center justify-center font-bold">
            ✓
          </div>
          <span>Your Selected Seat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300" />
          <span>Occupied</span>
        </div>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="text-slate-500">
          LB: Lower Berth · MB: Middle Berth · UB: Upper Berth · SL: Side Lower · SU: Side Upper
        </span>
      </div>
    </div>
  );
};

interface SeatButtonProps {
  seat: SeatModel;
  passengers: Passenger[];
  activePassengerIndex: number;
  onClick: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seat,
  passengers,
  activePassengerIndex,
  onClick,
}) => {
  const assignedPassenger = passengers.find((p) => p.assignedSeat === String(seat.number));
  const isSelectedByActive =
    assignedPassenger && passengers[activePassengerIndex]?.id === assignedPassenger.id;

  if (seat.isBooked) {
    return (
      <div
        className="w-16 h-9 rounded bg-slate-200/90 border border-slate-300 flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono cursor-not-allowed select-none"
        title="Seat already booked"
      >
        <span className="font-bold">{seat.number}</span>
        <span className="text-[9px]">{seat.berthType.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  if (assignedPassenger) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-16 h-9 rounded bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 flex flex-col items-center justify-center text-[10px] font-mono shadow-xs transition-colors cursor-pointer"
        title={`Selected by ${assignedPassenger.fullName || 'Passenger'}`}
      >
        <span className="font-bold">{seat.number}</span>
        <span className="text-[9px] font-semibold truncate max-w-[54px]">
          {assignedPassenger.fullName ? assignedPassenger.fullName.split(' ')[0] : 'Selected'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-16 h-9 rounded bg-white hover:bg-emerald-50 hover:border-emerald-600 border border-slate-300 flex flex-col items-center justify-center text-[10px] font-mono text-slate-800 transition-all cursor-pointer shadow-2xs"
      title={`Click to assign Seat ${seat.number} (${seat.berthType})`}
    >
      <span className="font-bold">{seat.number}</span>
      <span className="text-[9px] text-slate-500">{seat.berthType.slice(0, 2).toUpperCase()}</span>
    </button>
  );
};

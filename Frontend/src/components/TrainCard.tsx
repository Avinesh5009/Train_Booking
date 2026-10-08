import React from 'react';
import { ArrowRight, Clock, Info } from 'lucide-react';
import { Train } from '../types/railway';

interface TrainCardProps {
  train: Train;
  onOpenSchedule: (train: Train) => void;
  onSelectTrainForBooking: (train: Train, classCode: string) => void;
}

export const TrainCard: React.FC<TrainCardProps> = ({
  train,
  onOpenSchedule,
  onSelectTrainForBooking,
}) => {
  const classCodes = Object.keys(train.classes);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4">
      {/* Header: Name, number, route schedule link */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            #{train.number}
          </span>
          <h3 className="font-bold text-slate-900 text-base">
            {train.name}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            ({train.type})
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenSchedule(train)}
          className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>View Stops</span>
        </button>
      </div>

      {/* Route & Times */}
      <div className="grid grid-cols-3 sm:grid-cols-12 gap-3 items-center py-1">
        {/* Departure */}
        <div className="sm:col-span-4">
          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
            {train.departureTime}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-800">
            {train.origin.city} ({train.origin.code})
          </div>
          <div className="text-xs text-slate-400 truncate">
            {train.origin.name}
          </div>
        </div>

        {/* Duration */}
        <div className="sm:col-span-4 text-center">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{train.duration}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-slate-300">
            <div className="h-0.5 w-12 sm:w-20 bg-slate-200" />
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <div className="h-0.5 w-12 sm:w-20 bg-slate-200" />
          </div>
        </div>

        {/* Arrival */}
        <div className="sm:col-span-4 text-right">
          <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
            {train.arrivalTime}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-800">
            {train.destination.city} ({train.destination.code})
          </div>
          <div className="text-xs text-slate-400 truncate">
            {train.destination.name}
          </div>
        </div>
      </div>

      {/* Available Classes & Fast Book Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {classCodes.map((code) => {
            const c = train.classes[code];
            return (
              <button
                key={code}
                type="button"
                onClick={() => onSelectTrainForBooking(train, code)}
                className="px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 font-mono">
                    {code}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    ₹{c.basePrice}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-emerald-800">
                  {c.seatsAvailable} seats available
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelectTrainForBooking(train, classCodes[0])}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

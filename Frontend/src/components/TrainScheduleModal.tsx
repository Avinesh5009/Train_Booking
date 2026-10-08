import React from 'react';
import { X, Clock, MapPin, Train as TrainIcon } from 'lucide-react';
import { Train } from '../types/railway';

interface TrainScheduleModalProps {
  train: Train | null;
  onClose: () => void;
}

export const TrainScheduleModal: React.FC<TrainScheduleModalProps> = ({
  train,
  onClose,
}) => {
  if (!train) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrainIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded tabular-nums">
                  #{train.number}
                </span>
                <h3 className="text-base font-bold text-slate-900">{train.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {train.origin.city} ({train.origin.code}) → {train.destination.city} ({train.destination.code}) · {train.duration} · {train.totalDistanceKm} km
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {train.stops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === train.stops.length - 1;

              return (
                <div key={stop.stationCode} className="relative flex items-start justify-between gap-4">
                  {/* Circle marker */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      isFirst || isLast
                        ? 'border-emerald-700 bg-emerald-700'
                        : 'border-emerald-500'
                    }`}
                  >
                    {(isFirst || isLast) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Station info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {stop.stationName}
                      </span>
                      <span className="font-mono text-xs text-slate-500 font-medium">
                        ({stop.stationCode})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Platform {stop.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span>Day {stop.day}</span>
                      <span aria-hidden="true">·</span>
                      <span>{stop.distanceKm} km</span>
                      {stop.haltMinutes > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-medium">
                            {stop.haltMinutes} min halt
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                      {isFirst ? stop.departureTime : isLast ? stop.arrivalTime : stop.arrivalTime}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isFirst ? 'Departure' : isLast ? 'Arrival' : `Dept: ${stop.departureTime}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Pantry: {train.pantryAvailable ? 'Available on board' : 'No pantry'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

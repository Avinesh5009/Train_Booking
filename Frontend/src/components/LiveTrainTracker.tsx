import React, { useState } from 'react';
import { Compass, Train, Clock, MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { MOCK_TRAINS } from '../data/mockRailwayData';
import { Train as TrainType } from '../types/railway';

interface LiveTrainTrackerProps {
  initialTrainNumber?: string;
  onBookTrain: (train: TrainType) => void;
}

export const LiveTrainTracker: React.FC<LiveTrainTrackerProps> = ({
  initialTrainNumber,
  onBookTrain,
}) => {
  const [selectedTrainNumber, setSelectedTrainNumber] = useState(
    initialTrainNumber || MOCK_TRAINS[0].number
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const train =
    MOCK_TRAINS.find((t) => t.number === selectedTrainNumber) || MOCK_TRAINS[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Simulate current progress along stops
  const currentStopIndex = Math.min(1, train.stops.length - 2);
  const currentStop = train.stops[currentStopIndex];
  const nextStop = train.stops[currentStopIndex + 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search & Selector Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Live Train Running Status (GPS Tracker)
              </h2>
              <p className="text-xs text-slate-500">
                Live location, delays, platform assignments, and estimated arrival times.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* Train selector dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Running Train
            </label>
            <select
              value={selectedTrainNumber}
              onChange={(e) => setSelectedTrainNumber(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-none cursor-pointer"
            >
              {MOCK_TRAINS.map((t) => (
                <option key={t.number} value={t.number}>
                  #{t.number} {t.name} ({t.origin.city} → {t.destination.city})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 flex items-end">
            <button
              type="button"
              onClick={() => onBookTrain(train)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Book Tickets on this Train
            </button>
          </div>
        </div>
      </div>

      {/* Live Status Board */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner with on-time status */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded">
                #{train.number}
              </span>
              <h3 className="text-base font-bold">{train.name}</h3>
              <span className="text-xs text-slate-300">({train.type})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Running today · Origin: {train.origin.name} ({train.origin.code}) → {train.destination.name} ({train.destination.code})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>RUNNING ON TIME</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400 block">Avg Speed</span>
              <span className="font-mono font-bold text-white">92 km/h</span>
            </div>
          </div>
        </div>

        {/* Current status summary card */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-emerald-700" />
            <span>
              Passed <strong>{currentStop.stationName} ({currentStop.stationCode})</strong> at {currentStop.departureTime}.
            </span>
          </div>

          <div>
            Next Station:{' '}
            <strong className="text-slate-900">
              {nextStop.stationName} ({nextStop.stationCode})
            </strong>{' '}
            · Expected in <span className="font-mono font-bold text-emerald-800">22 mins</span> (Platform {nextStop.platform})
          </div>
        </div>

        {/* Station-by-Station Timeline */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="relative pl-8 sm:pl-10 space-y-7 before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {train.stops.map((stop, index) => {
              const isPassed = index <= currentStopIndex;
              const isCurrent = index === currentStopIndex;
              const isNext = index === currentStopIndex + 1;
              const isLast = index === train.stops.length - 1;

              return (
                <div key={stop.stationCode} className="relative flex items-start justify-between gap-4">
                  {/* Timeline icon */}
                  <div
                    className={`absolute -left-8 sm:-left-10 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isPassed
                        ? 'border-emerald-600 bg-white text-emerald-600'
                        : 'border-slate-300 bg-white text-slate-300'
                    }`}
                  >
                    {isCurrent ? (
                      <Train className="w-3 h-3 text-white" />
                    ) : isPassed ? (
                      <CheckCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Station info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {stop.stationName}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        ({stop.stationCode})
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded animate-pulse">
                          RECENTLY DEPARTED
                        </span>
                      )}
                      {isNext && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          APPROACHING NEXT
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Platform #{stop.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span>Day {stop.day}</span>
                      <span aria-hidden="true">·</span>
                      <span>{stop.distanceKm} km from start</span>
                      {stop.haltMinutes > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Halt: {stop.haltMinutes}m</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scheduled vs Actual */}
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                      {index === 0 ? stop.departureTime : stop.arrivalTime}
                    </div>
                    <div className="text-[11px] font-medium text-emerald-700">
                      Right Time (0m delay)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowLeftRight, Search, Calendar, MapPin } from 'lucide-react';
import { STATIONS } from '../data/mockRailwayData';

interface TrainSearchWidgetProps {
  fromCode: string;
  toCode: string;
  journeyDate: string;
  onSearch: (params: {
    fromCode: string;
    toCode: string;
    journeyDate: string;
  }) => void;
}

export const TrainSearchWidget: React.FC<TrainSearchWidgetProps> = ({
  fromCode: initialFrom,
  toCode: initialTo,
  journeyDate: initialDate,
  onSearch,
}) => {
  const [fromCode, setFromCode] = useState(initialFrom || 'NDLS');
  const [toCode, setToCode] = useState(initialTo || 'MMCT');
  const [journeyDate, setJourneyDate] = useState(initialDate);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCode === toCode) return;
    onSearch({ fromCode, toCode, journeyDate });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* From */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              From Station
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
            >
              {STATIONS.map((s) => (
                <option key={s.code} value={s.code} disabled={s.code === toCode}>
                  {s.city} ({s.code}) - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center -my-1 md:my-0 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap Stations"
              className="p-2 rounded-full hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              To Station
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
            >
              {STATIONS.map((s) => (
                <option key={s.code} value={s.code} disabled={s.code === fromCode}>
                  {s.city} ({s.code}) - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={journeyDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Popular:</span>
            <button
              type="button"
              onClick={() => {
                setFromCode('HYB');
                setToCode('MAS');
                onSearch({ fromCode: 'HYB', toCode: 'MAS', journeyDate });
              }}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              Hyderabad - Chennai
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setFromCode('NDLS');
                setToCode('MMCT');
                onSearch({ fromCode: 'NDLS', toCode: 'MMCT', journeyDate });
              }}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              Delhi - Mumbai
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setFromCode('SBC');
                setToCode('MAS');
                onSearch({ fromCode: 'SBC', toCode: 'MAS', journeyDate });
              }}
              className="hover:text-emerald-700 underline cursor-pointer"
            >
              Bengaluru - Chennai
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Search Trains</span>
          </button>
        </div>
      </form>
    </div>
  );
};

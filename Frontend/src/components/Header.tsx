import React from 'react';
import { Train } from 'lucide-react';
import { SupabaseStatusBadge } from './SupabaseStatusBadge';

interface HeaderProps {
  activeTab: 'search' | 'pnr' | 'bookings';
  onSelectTab: (tab: 'search' | 'pnr' | 'bookings') => void;
  bookingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  bookingCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('search')}
          className="flex items-center gap-2.5 text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Train className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            RailTicket
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <SupabaseStatusBadge />

          {/* Simple 3 Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-lg text-xs sm:text-sm font-medium">
          <button
            onClick={() => onSelectTab('search')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Book Ticket
          </button>

          <button
            onClick={() => onSelectTab('pnr')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'pnr'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Check PNR
          </button>

          <button
            onClick={() => onSelectTab('bookings')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span className="font-mono text-xs bg-slate-200 text-slate-700 px-1.5 rounded-full tabular-nums">
                {bookingCount}
              </span>
            )}
          </button>
        </nav>
        </div>
      </div>
    </header>
  );
};

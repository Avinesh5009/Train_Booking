import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, XCircle, Copy, Check, ExternalLink, RefreshCw, UploadCloud, Loader2 } from 'lucide-react';
import { testSupabaseConnection, syncLocalBookingsToSupabase } from '../services/supabase';
import { getStoredBookings } from '../data/mockRailwayData';

export const SupabaseStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<{
    connected: boolean;
    tableReady: boolean;
    message: string;
    loading: boolean;
  }>({
    connected: false,
    tableReady: false,
    message: 'Checking Supabase connection...',
    loading: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, loading: true }));
    const res = await testSupabaseConnection();
    setStatus({
      connected: res.connected,
      tableReady: res.tableReady,
      message: res.message,
      loading: false,
    });
  };

  const handleSyncLocalToSupabase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const local = getStoredBookings();
      if (!local || local.length === 0) {
        setSyncFeedback('No local bookings to sync.');
        return;
      }
      const res = await syncLocalBookingsToSupabase(local);
      if (res.success) {
        setSyncFeedback(`Successfully synced ${res.count} booking(s) to Supabase!`);
      } else {
        setSyncFeedback(`Sync failed: ${res.error}`);
      }
    } catch (e: any) {
      setSyncFeedback(`Sync error: ${e.message || 'Unknown'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const sqlCode = `-- Run this in Supabase -> SQL Editor -> New Query:
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    pnr TEXT NOT NULL UNIQUE,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    train_type TEXT,
    origin_code TEXT NOT NULL,
    origin_name TEXT,
    destination_code TEXT NOT NULL,
    destination_name TEXT,
    journey_date TEXT NOT NULL,
    departure_time TEXT,
    arrival_time TEXT,
    duration TEXT,
    class_code TEXT NOT NULL,
    class_name TEXT,
    quota TEXT DEFAULT 'General Quota',
    passengers JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    base_fare NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reservation_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    insurance_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_fare NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMPTZ DEFAULT now(),
    cancelled_at TIMESTAMPTZ,
    refund_amount NUMERIC(12, 2) DEFAULT 0,
    platform_number INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated roles to read and write bookings
CREATE POLICY "Allow public read access on bookings"
    ON public.bookings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert access on bookings"
    ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update access on bookings"
    ON public.bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;
NOTIFY pgrst, 'reload schema';`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border shadow-2xs"
        style={{
          backgroundColor: status.tableReady
            ? '#ecfdf5'
            : status.connected
            ? '#fffbeb'
            : '#fef2f2',
          borderColor: status.tableReady
            ? '#a7f3d0'
            : status.connected
            ? '#fde68a'
            : '#fecaca',
          color: status.tableReady
            ? '#065f46'
            : status.connected
            ? '#92400e'
            : '#991b1b',
        }}
        title="Click to view Supabase connection details and SQL setup"
      >
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {status.loading
            ? 'Supabase: Connecting...'
            : status.tableReady
            ? 'Supabase: Connected & Synced'
            : status.connected
            ? 'Supabase: Setup Table'
            : 'Supabase: Offline'}
        </span>
        <span className="sm:hidden">
          {status.tableReady ? 'Supabase ✓' : 'Supabase'}
        </span>
        {status.tableReady ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        ) : status.connected ? (
          <AlertTriangle className="w-3 h-3 text-amber-600" />
        ) : (
          <XCircle className="w-3 h-3 text-red-600" />
        )}
      </button>

      {/* Supabase Setup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Supabase Database Integration
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Project: gevzqlphosoimdfpzmxx
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Connection Status Box */}
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                status.tableReady
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : status.connected
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {status.tableReady ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : status.connected ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <strong className="block font-semibold">
                  {status.tableReady
                    ? 'All systems ready!'
                    : status.connected
                    ? 'Action Required: Run SQL script in Supabase'
                    : 'Connection error'}
                </strong>
                <p className="mt-0.5 leading-relaxed">{status.message}</p>
              </div>
              <button
                type="button"
                onClick={checkConnection}
                disabled={status.loading}
                className="text-xs font-semibold px-2 py-1 bg-white/80 hover:bg-white border rounded shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${status.loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                How to view your bookings in Supabase:
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>
                  Open your{' '}
                  <a
                    href="https://supabase.com/dashboard/project/gevzqlphosoimdfpzmxx/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 underline font-medium inline-flex items-center gap-0.5"
                  >
                    Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </li>
                <li>Copy the SQL script below and paste it into the SQL editor.</li>
                <li>Click <strong>Run</strong> in Supabase.</li>
                <li>
                  Go to <strong>Table Editor → public.bookings</strong> to view all booked tickets in real time!
                </li>
              </ol>
            </div>

            {/* SQL Script Box with Copy Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 font-semibold">
                  supabase-schema.sql
                </span>
                <button
                  type="button"
                  onClick={copySql}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                <code>{sqlCode}</code>
              </pre>
            </div>

            {status.tableReady && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-emerald-900 block font-semibold">
                    Sync Local Data to Supabase
                  </strong>
                  <span className="text-emerald-700 text-[11px]">
                    Push existing local tickets into your Supabase database.
                  </span>
                  {syncFeedback && (
                    <span className="block mt-1 text-[11px] font-semibold text-emerald-800">
                      {syncFeedback}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSyncLocalToSupabase}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  {isSyncing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

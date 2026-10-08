/**
 * REST API client for connecting to the Spring Boot backend
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message ?? `Request failed: ${response.status}`);
  return body as T;
}

export const railwayApi = {
  stations: (q = '') => request(`/stations${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  searchTrains: (from: string, to: string, date: string) =>
    request(`/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`),

  train: (id: number) => request(`/trains/${id}`),

  schedule: (id: number) => request(`/trains/${id}/schedule`),

  seats: (trainId: number, classCode: string, date: string) =>
    request(`/trains/${trainId}/classes/${encodeURIComponent(classCode)}/seats?date=${date}`),

  bookings: () => request('/bookings'),

  bookingByPnr: (pnr: string) =>
    request(`/bookings/pnr/${encodeURIComponent(pnr)}`),

  createBooking: (payload: unknown) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  cancelBooking: (bookingId: string) =>
    request(`/bookings/${bookingId}/cancel`, { method: 'POST' }),

  health: () => request('/health'),
};

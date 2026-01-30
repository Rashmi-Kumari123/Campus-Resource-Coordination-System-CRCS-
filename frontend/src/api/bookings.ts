import { apiClient } from './client';
import type { Booking, PageResponse, CreateBookingRequest } from '../types';

export interface AvailabilityCheckResponse {
  available: boolean;
  resourceId: string;
  startTime: string;
  endTime: string;
  message: string;
}

export const bookingsApi = {
  checkAvailability: (params: {
    resourceId: string;
    startTime: string;
    endTime: string;
  }) =>
    apiClient.get<AvailabilityCheckResponse>('/bookings/availability', { params }).then((r) => r.data),

  checkAvailabilityPost: (body: CreateBookingRequest) =>
    apiClient.post<AvailabilityCheckResponse>('/bookings/availability', body).then((r) => r.data),

  create: (body: CreateBookingRequest) =>
    apiClient.post<Booking>('/bookings', body).then((r) => r.data),

  getById: (id: string) => apiClient.get<Booking>(`/bookings/${id}`).then((r) => r.data),

  getUserBookings: (userId: string, params?: { page?: number; size?: number }) =>
    apiClient.get<PageResponse<Booking>>(`/bookings/user/${userId}`, { params }).then((r) => r.data),

  getResourceBookings: (resourceId: string, params?: { page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<Booking>>(`/bookings/resource/${resourceId}`, { params })
      .then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient
      .patch<Booking>(`/bookings/${id}/status`, { status })
      .then((r) => r.data),

  approve: (id: string) =>
    apiClient.post<Booking>(`/bookings/${id}/approve`).then((r) => r.data),

  cancel: (id: string) =>
    apiClient.post<{ message: string }>(`/bookings/${id}/cancel`).then((r) => r.data),
};

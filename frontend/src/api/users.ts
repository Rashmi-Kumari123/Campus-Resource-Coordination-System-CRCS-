import { apiClient } from './client';
import type { UserProfile, PageResponse } from '../types';

export interface CreateUserProfileRequest {
  userId: string;
  email: string;
  name?: string;
  role?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

export const usersApi = {
  getProfile: (userId: string) =>
    apiClient.get<UserProfile>(`/users/${userId}`).then((r) => r.data),

  updateProfile: (userId: string, body: UpdateUserProfileRequest) =>
    apiClient.put<{ message: string; data: UserProfile }>(`/users/${userId}`, body).then((r) => r.data),

  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<PageResponse<UserProfile>>('/users', { params }).then((r) => r.data),

  create: (body: CreateUserProfileRequest) =>
    apiClient.post<UserProfile>('/users', body).then((r) => r.data),

  deactivate: (userId: string) =>
    apiClient.post<{ message: string }>(`/users/${userId}/deactivate`).then((r) => r.data),

  delete: (userId: string) =>
    apiClient.delete<{ message: string }>(`/users/${userId}`).then((r) => r.data),
};

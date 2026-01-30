import { apiClient } from './client';
import type {
  Resource,
  PageResponse,
  CreateResourceRequest,
  UpdateResourceRequest,
  ResourceType,
} from '../types';

export const resourcesApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    apiClient.get<PageResponse<Resource>>('/resources', { params }).then((r) => r.data),

  getById: (id: string) => apiClient.get<Resource>(`/resources/${id}`).then((r) => r.data),

  getByType: (type: ResourceType, params?: { page?: number; size?: number }) =>
    apiClient.get<PageResponse<Resource>>(`/resources/type/${type}`, { params }).then((r) => r.data),

  getAvailable: (params?: { page?: number; size?: number }) =>
    apiClient.get<PageResponse<Resource>>('/resources/available', { params }).then((r) => r.data),

  create: (body: CreateResourceRequest) =>
    apiClient.post<Resource>('/resources', body).then((r) => r.data),

  update: (id: string, body: UpdateResourceRequest) =>
    apiClient.put<Resource>(`/resources/${id}`, body).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient
      .patch<{ message: string }>(`/resources/${id}/status`, null, { params: { status } })
      .then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<{ message: string }>(`/resources/${id}`).then((r) => r.data),

  getByOwner: (ownerId: string) =>
    apiClient.get<Resource[]>(`/resources/owner/${ownerId}`).then((r) => r.data),
};

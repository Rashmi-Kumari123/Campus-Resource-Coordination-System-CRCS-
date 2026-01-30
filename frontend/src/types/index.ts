// Align with backend roles
export type UserRole = 'USER' | 'RESOURCE_MANAGER' | 'FACILITY_MANAGER' | 'ADMIN';

export interface UserInfo {
  userId: string;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  claims: { role: UserRole; userId: string };
  user: UserInfo;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string | null;
  role: UserRole;
  profilePicture?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ResourceType = 'ROOM' | 'LAB' | 'HALL' | 'EQUIPMENT' | 'CAFETERIA' | 'LIBRARY' | 'PARKING' | 'SPORTS';
export type ResourceStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description?: string | null;
  status: ResourceStatus;
  location?: string | null;
  capacity?: number | null;
  ownerId?: string | null;
  responsiblePerson?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourceRequest {
  name: string;
  type: ResourceType;
  description?: string;
  location?: string;
  capacity?: number;
  ownerId?: string;
  responsiblePerson?: string;
}

export interface UpdateResourceRequest {
  name?: string;
  description?: string;
  location?: string;
  capacity?: number;
  status?: ResourceStatus;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  userId: string;
  resourceId: string;
  resourceName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  resourceId: string;
  startTime: string; // ISO 8601
  endTime: string;
  purpose?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiError {
  message: string;
  timestamp?: string;
  data?: unknown;
}

export const ROLES: UserRole[] = ['USER', 'RESOURCE_MANAGER', 'FACILITY_MANAGER', 'ADMIN'];

export function canManageResources(role: UserRole): boolean {
  return ['ADMIN', 'RESOURCE_MANAGER', 'FACILITY_MANAGER'].includes(role);
}

export function canApproveBookings(role: UserRole): boolean {
  return ['ADMIN', 'FACILITY_MANAGER'].includes(role);
}

export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN';
}

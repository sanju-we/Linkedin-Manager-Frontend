/**
 * Shared type definitions
 */

// User Types
export interface UserData {
  _id: string;
  name: string;
  role: string;
  linkedAcc?: string;
  weeklyLimitPic?: string[];
  currentCount?: number;
  growth?: number;
  profile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminData  {
  name:string,
  role:string
}

export interface UserAuth {
  id: string;
  name: string;
  role: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Login Types
export interface LoginRequest {
  name: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// Form Error Types
export interface FormErrors {
  [key: string]: string;
}


/**
 * API-specific type definitions
 */

import { ApiResponse } from './index';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  showToast?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
}

export interface ApiRequestConfig {
  url: string;
  method: ApiMethod;
  body?: unknown;
  options?: ApiOptions;
}

export type ApiRequestFunction<T = unknown> = (
  url: string,
  ...args: unknown[]
) => Promise<ApiResponse<T> | null>;


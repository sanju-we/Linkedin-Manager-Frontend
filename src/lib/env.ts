/**
 * Environment variables configuration
 * All environment variables should be accessed through this file
 */

export const env = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api',
    refreshTokenURL: process.env.NEXT_PUBLIC_REFRESH_TOKEN_URL || 'http://localhost:5001/api/user/refresh',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'LinkedIn Management',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'LinkedIn Management Application',
  },
} as const;


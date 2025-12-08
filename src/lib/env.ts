/**
 * Environment variables configuration
 * All environment variables should be accessed through this file
 */

export const env = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    refreshTokenURL: process.env.NEXT_PUBLIC_REFRESH_TOKEN_URL,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'LinkedIn Management',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'LinkedIn Management Application',
  },
} as const;


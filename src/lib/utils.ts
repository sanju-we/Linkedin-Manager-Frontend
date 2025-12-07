/**
 * Utility functions
 */

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "N/A";
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return "N/A";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Gets role badge color classes
 */
export const getRoleBadgeColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 border-purple-300",
    user: "bg-blue-100 text-blue-700 border-blue-300",
    moderator: "bg-green-100 text-green-700 border-green-300",
  };
  return colors[role.toLowerCase()] || colors.user;
};

/**
 * Checks if code is running in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Safely extracts error message from various error formats
 */
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    if ('response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { data?: { message?: string } };
      return response.data?.message || 'Request failed';
    }
    if ('data' in error && error.data && typeof error.data === 'object') {
      const data = error.data as { message?: string };
      return data.message || 'Request failed';
    }
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
};


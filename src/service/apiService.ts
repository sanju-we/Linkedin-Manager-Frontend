import api from "./serverApi";
import toast from "react-hot-toast";
import { ApiResponse, ApiError } from "@/types";

type ApiOption = {
  showToast?: boolean;
};

const defaultOptions: ApiOption = {
  showToast: true,
};

/**
 * Handles API errors and displays toast notifications
 */
const handleAPIerror = (error: unknown, options: ApiOption): void => {
  if (!options.showToast) return;

  let message = 'Request failed. Please try again.';

  // Extract error message from different error formats
  if (error && typeof error === 'object') {
    if ('response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { data?: { message?: string }; status?: number };
      message = response.data?.message || message;
      
      // Log detailed error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error Response:', {
          status: response.status,
          data: response.data,
          message: response.data?.message,
        });
      }
    } else if ('data' in error && error.data && typeof error.data === 'object') {
      const data = error.data as { message?: string };
      message = data.message || message;
    } else if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    }
  }

  // Log error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('API error:', error);
  }

  toast.error(message);
};

/**
 * Makes a POST request to the API
 */
export const postRequest = async <T = unknown>(
  url: string,
  body: object | FormData,
  options: ApiOption = defaultOptions
): Promise<ApiResponse<T> | null> => {
  try {
    // For FormData, don't set Content-Type - let browser set it with boundary
    // For JSON, set Content-Type explicitly
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    // If FormData, axios will automatically set Content-Type: multipart/form-data with boundary

    if (process.env.NODE_ENV === 'development') {
      console.log('POST Request:', {
        url,
        isFormData: body instanceof FormData,
        headers,
      });
    }

    const res = await api.post(url, body, { headers });

    if (!res.data.success) {
      handleAPIerror(res, options);
      return null;
    }

    return res.data;
  } catch (error) {
    handleAPIerror(error, options);
    return null;
  }
};

/**
 * Makes a GET request to the API
 */
export const getRequest = async <T = unknown>(
  url: string,
  params?: object,
  options: ApiOption = defaultOptions
): Promise<ApiResponse<T> | null> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending GET request to:', url);
    }

    const res = await api.get(url, params ? { params } : {});

    if (!res.data.success) {
      handleAPIerror(res, options);
      return null;
    }

    return res.data;
  } catch (error) {
    handleAPIerror(error, options);
    return null;
  }
};

/**
 * Makes a PATCH request to the API
 */
export const patchRequest = async <T = unknown>(
  url: string,
  body: object | FormData,
  options: ApiOption = defaultOptions
): Promise<ApiResponse<T> | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await api.patch(url, body, { headers });

    if (!res.data.success) {
      handleAPIerror(res, options);
      return null;
    }

    return res.data;
  } catch (error) {
    handleAPIerror(error, options);
    return null;
  }
};

/**
 * Makes a PUT request to the API
 */
export const putRequest = async <T = unknown>(
  url: string,
  body: object | FormData,
  options: ApiOption = defaultOptions
): Promise<ApiResponse<T> | null> => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await api.put(url, body, { headers });

    if (!res.data.success) {
      handleAPIerror(res, options);
      return null;
    }

    return res.data;
  } catch (error) {
    handleAPIerror(error, options);
    return null;
  }
};

/**
 * Makes a DELETE request to the API
 */
export const deleteRequest = async <T = unknown>(
  url: string,
  params?: object,
  options: ApiOption = defaultOptions
): Promise<ApiResponse<T> | null> => {
  try {
    const res = await api.delete(url, params ? { params } : {});

    if (!res.data.success) {
      handleAPIerror(res, options);
      return null;
    }

    return res.data;
  } catch (error) {
    handleAPIerror(error, options);
    return null;
  }
};

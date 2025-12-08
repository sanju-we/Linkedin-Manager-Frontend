import { postRequest, getRequest } from "../apiService";
import { ADMIN_ROUTES } from "../Constant/admin.api.constant";
import { ApiResponse } from "@/types";
import { LoginRequest, AdminData } from "@/types";

const post = postRequest
const get = getRequest

export const ADMIN_SERVICE = {
  LOGIN: (data: LoginRequest): Promise<ApiResponse | null> => post(ADMIN_ROUTES.auth.login, data),
  GETALL: (): Promise<ApiResponse | null> => get(ADMIN_ROUTES.user.getAll),
  GETUSER: <T = unknown>(userId: string): Promise<ApiResponse<T> | null> => get(ADMIN_ROUTES.user.getUser(userId)),
  // APPROVE_REQUEST,

}
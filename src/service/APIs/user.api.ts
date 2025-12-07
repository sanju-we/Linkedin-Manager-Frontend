import { postRequest, getRequest } from "../apiService";
import { USER_ROUTES } from "../Constant/user.api.constant";
import { ApiResponse } from "@/types";
import { LoginRequest, UserData } from "@/types";

const post = postRequest;
const get = getRequest;

export const USER_SERVICE = {
  LOGIN: (data: LoginRequest): Promise<ApiResponse | null> => 
    post(USER_ROUTES.auth.login, data),
  
  GETPROFILE: (): Promise<ApiResponse<UserData> | null> => 
    get(USER_ROUTES.profile.profile),
};

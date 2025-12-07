import { postRequest, getRequest } from "../apiService";
import { USER_ROUTES } from "../Constant/user.api.constant";

const post = postRequest;
const get = getRequest

export const USER_SERVICE = {
  LOGIN : (data:{name:string,password:string}) => post(USER_ROUTES.auth.login,data),
  GETPROFILE:() => get(USER_ROUTES.profile.profile)
}
import { postRequest } from "../apiService";
import { USER_ROUTES } from "../Constant/user.api.constant";

const post = postRequest;

export const USER_SERVICE = {
  LOGIN : (data:{email:string,password:string}) => post(USER_ROUTES.auth.login,data)
}
import { postRequest, getRequest } from "../apiService";
import { USER_ROUTES } from "../Constant/user.api.constant";
import { ApiResponse } from "@/types";
import { LoginRequest, UserData } from "@/types";
import { compressImage } from "@/lib/imageUtils";

const post = postRequest;
const get = getRequest;

export const USER_SERVICE = {
  LOGIN: (data: LoginRequest): Promise<ApiResponse | null> => 
    post(USER_ROUTES.auth.login, data),
  
  GETPROFILE: (): Promise<ApiResponse<UserData> | null> => 
    get(USER_ROUTES.profile.profile),
  
  UPDATE_COUNT: (count: number): Promise<ApiResponse<UserData> | null> => 
    post(USER_ROUTES.profile.updateCount, { count }),
  
  UPLOAD_IMAGE: async (file: File): Promise<ApiResponse<UserData> | null> => {
    try {
      // Compress image before uploading (max 1920x1920, quality 0.8)
      const compressedFile = await compressImage(file, 1920, 1920, 0.8);
      
      // Create FormData with the field name 'image' (must match backend)
      const formData = new FormData();
      formData.append('image', compressedFile); // Field name matches backend: upload.single('image')
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Uploading image:', {
          originalSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          compressedSize: `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
          fieldName: 'image',
          fileName: compressedFile.name,
          fileType: compressedFile.type,
        });
      }
      
      return post(USER_ROUTES.profile.uploadImage, formData, { showToast: true });
    } catch (error) {
      console.error('Image compression error:', error);
      // Fallback: upload original file if compression fails
      const formData = new FormData();
      formData.append('image', file);
      return post(USER_ROUTES.profile.uploadImage, formData, { showToast: true });
    }
  },
};

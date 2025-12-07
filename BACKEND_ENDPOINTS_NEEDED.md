# Backend Endpoints Needed

The frontend has been updated with the following features. You need to implement these backend endpoints:

## Required Endpoints

### 1. Increment Current Count
**Endpoint**: `POST /api/user/profile/incrementCount`
**Auth**: Required (verifyToken middleware)
**Description**: Increments the user's current count. Should only work on Fridays.

**Request**: 
- No body needed (user ID from token)

**Response**:
```json
{
  "success": true,
  "message": "Count incremented successfully",
  "data": {
    "_id": "...",
    "name": "...",
    "currentCount": 5,
    "growth": 10.5,
    // ... other user fields
  }
}
```

**Logic**:
- Check if today is Friday
- Increment `currentCount` by 1
- Calculate and update `growth` percentage
- Return updated user data

### 2. Upload Image
**Endpoint**: `POST /api/user/profile/uploadImage`
**Auth**: Required (verifyToken middleware)
**Description**: Uploads an image to Cloudinary and adds it to user's weeklyLimitPic array.

**Request**: 
- Content-Type: `multipart/form-data`
- Field name: `image` (File)

**Response**:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "_id": "...",
    "name": "...",
    "weeklyLimitPic": ["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg"],
    // ... other user fields
  }
}
```

**Logic**:
- Receive image file from FormData
- Upload to Cloudinary
- Get Cloudinary URL
- Add URL to user's `weeklyLimitPic` array
- Save and return updated user data

## Backend Implementation Steps

1. **Install Cloudinary**:
   ```bash
   npm install cloudinary multer
   npm install --save-dev @types/multer
   ```

2. **Create Cloudinary Service** (optional):
   ```typescript
   // src/utils/cloudinary.ts
   import { v2 as cloudinary } from 'cloudinary';
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });
   
   export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
     // Upload logic
   };
   ```

3. **Add Multer Middleware** for file uploads:
   ```typescript
   import multer from 'multer';
   const upload = multer({ storage: multer.memoryStorage() });
   ```

4. **Update Routes**:
   - Add routes to `user.profile.routes.ts`
   - Add controller methods
   - Add service methods

5. **Update Interfaces**:
   - Add methods to `IUserProfileController`
   - Add methods to `IUserProfileService`

## Environment Variables Needed

Add to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Example Implementation Structure

```typescript
// Controller
async incrementCount(req: Request, res: Response): Promise<void> {
  const userId = req.user.id;
  const user = await this._userService.incrementCount(userId);
  sendResponse(res, STATUS_CODE.OK, true, "Count incremented successfully", user);
}

async uploadImage(req: Request, res: Response): Promise<void> {
  const userId = req.user.id;
  const file = req.file; // from multer
  const user = await this._userService.uploadImage(userId, file);
  sendResponse(res, STATUS_CODE.OK, true, "Image uploaded successfully", user);
}
```

## Notes

- The increment count should check if it's Friday before allowing the increment
- Image upload should validate file type and size
- Both endpoints should return the full updated user object for optimistic updates
- Growth calculation should be based on the previous count vs current count


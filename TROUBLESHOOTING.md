# Troubleshooting Guide

## CORS Issues

### Problem: CORS errors when accessing via IP address (e.g., 172.18.160.1:3000)

**Solution**: The server CORS configuration has been updated to automatically allow:
- `localhost` with any port
- Common local network IPs (192.168.x.x, 172.16-31.x.x, 10.x.x.x) with any port

### If you still get CORS errors:

1. **Check server is running**: Make sure your backend server is running on the correct port
2. **Check environment**: Ensure `NODE_ENV` is set to `development` for flexible CORS
3. **Restart both servers**: Restart both frontend and backend after changes

## localhost:3000 Not Rendering

### Problem: Cannot access Next.js app on localhost:3000

**Solutions**:

1. **Check if port is in use**:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Kill the process if needed
   taskkill /PID <PID> /F
   ```

2. **Use the network-enabled dev script**:
   ```bash
   npm run dev
   ```
   This now binds to `0.0.0.0` to allow network access.

3. **For localhost only** (if you don't need network access):
   ```bash
   npm run dev:local
   ```

4. **Check firewall**: Ensure Windows Firewall isn't blocking port 3000

5. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Network Access Setup

### To access from other devices on your network:

1. **Start the dev server with network binding**:
   ```bash
   npm run dev
   ```

2. **Find your local IP address**:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 172.18.160.1)
   ```

3. **Access from other devices**:
   - Use `http://<YOUR_IP>:3000` (e.g., `http://172.18.160.1:3000`)

4. **Backend CORS**: The server will automatically allow your IP in development mode

## Environment Variables

Make sure you have the correct environment variables set:

**Client** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
NEXT_PUBLIC_REFRESH_TOKEN_URL=http://localhost:5001/api/user/refresh
```

**Server** (`.env`):
```env
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Common Issues

### Issue: "Cannot GET /"
- **Cause**: Next.js routing issue
- **Solution**: Make sure you're accessing a valid route like `/login` or `/profile`

### Issue: API calls failing
- **Check**: Browser console for CORS errors
- **Check**: Network tab to see if requests are being sent
- **Check**: Backend server logs for errors

### Issue: Cookies not being set
- **Check**: `withCredentials: true` is set in axios config (already configured)
- **Check**: CORS `credentials: true` is set (already configured)
- **Check**: Browser isn't blocking third-party cookies

## Still Having Issues?

1. Check browser console for errors
2. Check server logs for errors
3. Verify both servers are running
4. Try clearing browser cache and cookies
5. Try incognito/private browsing mode


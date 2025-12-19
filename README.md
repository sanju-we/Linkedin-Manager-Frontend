# LinkedIn Management - Client

A modern Next.js application for LinkedIn management with TypeScript, Tailwind CSS, and React.

## 🚀 Features

- **Modern Stack**: Next.js 16 with App Router, React 19, TypeScript
- **Type Safety**: Full TypeScript support with strict mode
- **UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Cookie-based authentication with JWT tokens
- **API Integration**: Centralized API service with axios interceptors
- **Error Handling**: Comprehensive error handling with toast notifications

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (user)/            # User routes group
│   │   ├── login/         # Login page
│   │   └── profile/       # User profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── Toast.tsx          # Toast notification provider
├── hooks/                 # Custom React hooks (empty - ready for use)
├── lib/                   # Utility libraries
│   ├── env.ts             # Environment variables configuration
│   └── utils.ts           # Utility functions
├── service/               # API service layer
│   ├── APIs/              # API service methods
│   │   └── user.api.ts    # User API services
│   ├── Constant/          # API route constants
│   ├── apiService.ts      # HTTP request wrappers
│   └── serverApi.ts       # Axios instance with interceptors
├── types/                 # TypeScript type definitions
│   ├── index.ts           # Shared types
│   └── api.ts             # API-specific types
└── middleware.ts          # Next.js middleware for route protection
```

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
   NEXT_PUBLIC_REFRESH_TOKEN_URL=http://localhost:5001/api/user/refresh
   NEXT_PUBLIC_APP_NAME=LinkedIn Management
   NEXT_PUBLIC_APP_DESCRIPTION=LinkedIn Management Application
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔧 Configuration

### API Service

The API service is centralized in `src/service/`:

- **serverApi.ts**: Axios instance with request/response interceptors
- **apiService.ts**: HTTP method wrappers (GET, POST, PUT, PATCH, DELETE)
- **APIs/**: Service-specific API methods
- **Constant/**: API route constants

### Type Safety

All types are defined in `src/types/`:

- `index.ts`: Shared types (UserData, ApiResponse, etc.)
- `api.ts`: API-specific types

## 🎨 Code Quality Improvements

### ✅ Fixed Issues

1. **Typos Fixed**:
   - `midleware.ts` → `middleware.ts`
   - `admin.api.contant.ts` → `admin.api.constant.ts`

2. **Code Cleanup**:
   - Removed inappropriate language
   - Removed/reduced console.logs (only in development)
   - Improved error handling

3. **Environment Variables**:
   - Moved hardcoded URLs to environment variables
   - Created centralized env configuration

4. **Type Safety**:
   - Created proper type definitions
   - Removed `any` types where possible
   - Added proper TypeScript interfaces

5. **Error Handling**:
   - Improved error message extraction
   - Better error handling in API service
   - Consistent error handling across the app

6. **Code Organization**:
   - Created utility functions
   - Improved code structure
   - Better separation of concerns

### 🔒 Security Improvements

- Environment variables for sensitive configuration
- Proper cookie handling
- Secure token refresh flow

## 📝 Development Guidelines

### Adding New API Endpoints

1. Add route constant in `src/service/Constant/`
2. Add service method in `src/service/APIs/`
3. Use the service method in components

### Adding New Types

1. Add types to `src/types/index.ts` for shared types
2. Add API-specific types to `src/types/api.ts`

### Custom Hooks

Place custom hooks in `src/hooks/` directory.

### Reusable Components

Place reusable UI components in `src/reusable/` directory.

## 🧪 Testing

```bash
npm run lint
```

## 📦 Dependencies

- **Next.js 16**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **react-hot-toast**: Toast notifications
- **lucide-react**: Icons

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any Node.js hosting platform.

Make sure to set environment variables in your deployment platform.

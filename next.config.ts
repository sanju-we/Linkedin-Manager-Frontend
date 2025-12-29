import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  // Allow access from network IPs in development
  ...(process.env.NODE_ENV === 'development' && {
    // This allows Next.js to be accessed from network IPs
    experimental: {
      // Enable server components
    },
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || process.env.SERVER_API_URL || 'http://localhost:5001/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

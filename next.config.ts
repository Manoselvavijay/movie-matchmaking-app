import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://image.tmdb.org https://assets.nflxext.com", // Added Netflix assets
              "font-src 'self'",
              "connect-src 'self' ws: wss: https://api.themoviedb.org https://wcvooiykkiclexqqrwge.supabase.co", // Added Supabase URL
              "frame-src 'self' https://www.youtube.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

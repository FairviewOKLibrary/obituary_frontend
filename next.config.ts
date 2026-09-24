import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: false,
  crossOrigin: 'anonymous',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tukioswebsites.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'websites.tukios.com',
        port: '',
        pathname: '/images/no-image.jpg',
      },
    ],
  },
}

export default nextConfig;

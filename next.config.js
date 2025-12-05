/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'carefoundation-backend-1.onrender.com',
        pathname: '/uploads/**',
      },
    ],
    domains: [
      "localhost",         // local backend
      "caredigiworld.com", // your admin assets
      "ui-avatars.com",    // avatar images
      "images.unsplash.com", // unsplash images
      "carefoundation-backend-1.onrender.com", // production backend
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

module.exports = nextConfig;


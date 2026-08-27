/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors in production builds
    ignoreDuringBuilds: true,
  },
  optimizeFonts: false,
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig;

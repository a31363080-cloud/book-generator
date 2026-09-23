const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
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

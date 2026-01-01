import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turbopack fix: tells Next.js we are aware of custom webpack usage
  experimental: {
    turbopack: {
      // You can leave this empty
    },
  },
};

// Note: ESLint ignore is now handled in .eslintrc or via CLI, 
// so we removed the 'eslint' key from here.

export default withPWA(nextConfig);
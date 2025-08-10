// ==================================
// next.config.js
// ==================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    allowedDevOrigins: ['192.168.100.7:3000', 'localhost:3000'],
  },
}

module.exports = nextConfig

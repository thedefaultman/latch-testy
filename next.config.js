/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  },
  eslint: {
    // For beta deployment, don't fail on ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // For beta deployment, don't fail on TypeScript errors
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/beta',
      },
    ]
  },
}

module.exports = nextConfig
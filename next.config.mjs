/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['better-auth', '@better-auth/kysely-adapter', 'kysely'],
  },
}

export default nextConfig

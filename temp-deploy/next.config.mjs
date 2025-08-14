/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['localhost', 'wozif.store', '*.wozif.store'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.wozif.store',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wozif.store',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuration pour les sous-domaines
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/[storeId]/:path*',
        has: [
          {
            type: 'host',
            value: '(?<storeId>[^.]+)\.wozif\.store',
          },
        ],
      },
    ]
  },
  // Optimisations pour le développement
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // Configuration pour éviter les erreurs d'hydratation
  reactStrictMode: true,
  // Désactiver ESLint temporairement pour le build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

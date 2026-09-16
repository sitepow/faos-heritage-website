/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig = {
  allowedDevOrigins: ['*.lvh.me', 'lvh.me', 'localhost:3000', '127.0.0.1'],
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)

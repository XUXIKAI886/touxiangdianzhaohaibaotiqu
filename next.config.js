/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'p0.meituan.net',
      },
      {
        protocol: 'http',
        hostname: 'p1.meituan.net',
      },
      {
        protocol: 'https',
        hostname: 's3plus-img.sankuai.com',
      },
    ],
  },
}

module.exports = nextConfig

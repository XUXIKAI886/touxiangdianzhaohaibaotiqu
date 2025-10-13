/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
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
  basePath: process.env.NODE_ENV === 'production' ? '/touxiangdianzhaohaibaotiqu' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/touxiangdianzhaohaibaotiqu' : '',
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出模式 - 支持 Vercel 和 GitHub Pages 部署
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
  // GitHub Pages 部署时需要 basePath
  basePath: process.env.NODE_ENV === 'production' ? '/touxiangdianzhaohaibaotiqu' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/touxiangdianzhaohaibaotiqu' : '',
}

module.exports = nextConfig

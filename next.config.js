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
  // 只有 GitHub Pages 部署时才使用 basePath
  // Vercel 部署在根路径,不需要 basePath
  basePath: process.env.GITHUB_PAGES === 'true' ? '/touxiangdianzhaohaibaotiqu' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/touxiangdianzhaohaibaotiqu' : '',
}

module.exports = nextConfig

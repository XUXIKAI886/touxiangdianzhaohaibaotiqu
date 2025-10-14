# 外卖平台图片提取系统 (美团 & 饿了么)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

一个基于 Next.js 的多平台图片提取系统,支持美团外卖店铺图片和饿了么商品图片的自动提取、实时监控和批量下载。

[功能特性](#-功能特性) • [技术栈](#️-技术栈) • [快速开始](#-快速开始) • [使用说明](#-使用说明) • [平台对比](#-平台对比) • [项目结构](#-项目结构)

</div>

---

## 📸 系统预览

本系统提供两个独立的子系统,分别用于美团和饿了么平台的图片提取:

### 🏠 主页
- 🎯 平台选择入口
- 📱 响应式卡片布局
- 🎨 渐变主题设计

### 🍊 美团系统
- 🏪 店铺信息提取(头像、店招、海报)
- ⏱️ 实时文件监控(2秒轮询)
- 📋 彩色分类日志
- 💾 批量/单张下载

### 🔵 饿了么系统
- 🛒 商品信息提取(商品名称、商品图片)
- 📂 浏览器文件选择器
- 🔄 自动文件监控(2秒轮询)
- 🎯 商品名称自动去重
- 📦 批量下载(图片以商品名称命名)

---

## ✨ 功能特性

### 🍊 美团外卖系统

#### 核心功能
- ✅ **实时文件监控** - 每2秒自动检测 JSON 文件更新
- ✅ **智能数据解析** - 支持 \`poi_info\` 和 \`poi_base_info\` 两种 JSON 格式
- ✅ **店铺图片提取** - 自动提取店铺头像、店招、海报图片
- ✅ **图片去重** - 自动去除尺寸参数,获取原图
- ✅ **实时预览** - 图片加载完成后立即显示,支持多海报切换
- ✅ **批量下载** - 一键下载所有图片,自动以店铺名称命名
- ✅ **单张下载** - 每张图片支持独立下载按钮
- ✅ **自动清理** - 切换店铺时自动清空旧图片预览
- ✅ **历史记录** - 保存最近10条店铺记录,支持快速切换

#### UI 特色
- 🎨 **橙黄渐变主题** - 灵感来自美团品牌色
- 🌓 **深色模式支持** - 自动适配系统主题
- 📱 **响应式布局** - 完美支持桌面端和移动端
- 🔄 **实时日志** - 彩色分类日志(成功/错误/警告/信息)

### 🔵 饿了么系统

#### 核心功能
- ✅ **文件选择器** - 支持浏览器原生文件选择(推荐路径: \`D:\ailun\xiaochengxueleme.txt\`)
- ✅ **自动文件监控** - 选择文件后自动启动监控,每2秒检测变化
- ✅ **商品数据提取** - 从 JSON 提取商品名称和商品图片
- ✅ **imageHash 转换** - 自动将 imageHash 转换为完整 CDN URL
- ✅ **智能去重** - 根据商品名称自动去重,保留最新记录
- ✅ **实时预览** - 网格布局展示商品图片
- ✅ **批量下载** - 选择文件夹,批量保存所有商品图片
- ✅ **文件名命名** - 图片以商品名称命名,自动处理非法字符
- ✅ **运行日志** - 固定高度日志面板,详细记录操作过程

#### 技术亮点
- 🎯 **File System Access API** - 浏览器原生文件访问(需 Chrome 86+)
- 🖼️ **Canvas API** - 绕过 CORS 限制实现跨域图片下载
- 🔗 **URL 格式转换** - \`imageHash\` → \`https://cube.elemecdn.com/{dir1}/{dir2}/{filename}.{ext}\`
- 🎨 **蓝色渐变主题** - 区别于美团的橙色主题

#### UI 特色
- 🎨 **蓝青渐变主题** - 区别于美团,提供独特视觉体验
- 📋 **全宽日志面板** - 固定高度(400px),不随内容增长
- 🖼️ **底部图片展示** - 商品图片在底部网格展示
- 💡 **路径提示** - 引导用户快速导航到目标文件夹

---

## 🛠️ 技术栈

### 前端框架
- **[Next.js 14](https://nextjs.org/)** - React 全栈框架,使用 App Router
- **[React 18](https://react.dev/)** - 用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集

### 样式设计
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 高质量的 React 组件库
- **[Lucide React](https://lucide.dev/)** - 精美的图标库

### 核心技术
- **File System Access API** - 浏览器文件系统访问
- **Canvas API** - 图片处理和跨域下载
- **localStorage** - 本地数据存储(美团历史记录)
- **React Hooks** - 状态管理和副作用处理

---

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **浏览器** Chrome 86+ / Edge 86+ (饿了么系统需要)

### 安装步骤

#### 1. 克隆项目
\`\`\`bash
git clone https://github.com/XUXIKAI886/touxiangdianzhaohaibaotiqu.git
cd touxiangdianzhaohaibaotiqu
\`\`\`

#### 2. 安装依赖
\`\`\`bash
npm install
\`\`\`

#### 3. 启动开发服务器

**重要**: 每次启动前必须先检查并释放端口!

\`\`\`bash
# 第一步: 检查 3000 端口占用
netstat -ano | findstr :3000

# 第二步: 如果端口被占用,强制终止进程
taskkill /F /PID <进程ID>

# 第三步: 启动开发服务器
npm run dev
\`\`\`

服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

#### 4. Windows 快速启动

双击 \`start.bat\` 文件,自动安装依赖并启动服务器(已包含端口检查)。

---

## 📖 使用说明

### 🍊 美团外卖系统使用指南

#### 启动监控流程
1. **启动 Fiddler** 并确保脚本配置正确
2. **启动本系统** (访问 http://localhost:3000)
3. **点击"美团外卖"卡片** 进入美团系统
4. **点击"上传 JSON 文件"** 选择文件
5. **系统自动提取** 店铺图片
6. **下载图片** 使用批量下载或单张下载功能

---

### 🔵 饿了么系统使用指南

#### 启动监控流程
1. **启动 Fiddler** 并配置保存路径为 \`D:\ailun\xiaochengxueleme.txt\`
2. **启动本系统** (访问 http://localhost:3000)
3. **点击"饿了么"卡片** 进入饿了么系统
4. **点击"选择监控文件"按钮**
5. **在弹出的文件选择器中**:
   - 在地址栏输入: \`D:\ailun\`
   - 按 Enter 键快速跳转
   - 选择 \`xiaochengxueleme.txt\` 文件
6. **系统自动开始监控** (文件选择后自动启动)
7. **打开手机饿了么 APP**,浏览店铺商品
8. **系统自动检测** 文件更新并提取商品图片
9. **批量下载** 选择文件夹保存所有图片

#### 图片命名规则
下载的图片文件名格式:
- **格式**: \`{商品名称}.jpg\`
- **示例**: \`霸气橙子-[大杯650ml].jpg\`
- **非法字符处理**: 自动将 \`<>:"/\|?*\` 替换为 \`_\`

---

## 🔄 平台对比

| 特性 | 美团外卖系统 | 饿了么系统 |
|------|------------|-----------|
| **提取内容** | 店铺头像、店招、海报 | 商品名称、商品图片 |
| **文件选择** | JSON文件上传 | 浏览器文件选择器 |
| **监控方式** | 上传后自动提取 | 选择文件后自动启动 |
| **去重策略** | 店铺 ID 去重 | 商品名称去重 |
| **下载命名** | \`店铺名_类型.jpg\` | \`商品名称.jpg\` |
| **历史记录** | ✅ 支持(最多10条) | ❌ 不支持 |
| **主题配色** | 🍊 橙黄渐变 | 🔵 蓝青渐变 |
| **浏览器要求** | 现代浏览器 | Chrome 86+ / Edge 86+ |

---

## 📁 项目结构

\`\`\`
touxiangdianzhaohaibaotiqu/
├── app/                          # Next.js App Router 目录
│   ├── page.tsx                  # 🏠 主页 - 平台选择入口
│   ├── meituan/                  # 🍊 美团外卖系统
│   │   └── page.tsx              # 美团系统主页面
│   ├── eleme/                    # 🔵 饿了么系统
│   │   └── page.tsx              # 饿了么系统主页面
│   ├── layout.tsx                # 根布局组件
│   ├── globals.css               # 全局样式
│   └── favicon.ico               # 网站图标
│
├── components/                   # React 组件
│   └── ui/                       # shadcn/ui 组件库
│
├── public/                       # 静态资源
│   └── .nojekyll                 # GitHub Pages 配置
│
├── .github/workflows/            # GitHub Actions
│   └── deploy.yml                # 自动部署脚本
│
├── next.config.js                # Next.js 配置(静态导出)
├── package.json                  # 项目依赖配置
├── CLAUDE.md                     # Claude Code 项目指南
└── README.md                     # 📖 项目说明文档
\`\`\`

---

## 🔍 常见问题 (FAQ)

### Q: 饿了么系统为什么无法选择文件?
**A:** 请确认使用 Chrome 86+ 或 Edge 86+ 浏览器。

### Q: 图片404怎么办?
**A:** 查看控制台 \`[DEBUG]\` 日志确认生成的 URL 是否正确。

### Q: 端口被占用怎么办?
**A:** 执行:
\`\`\`bash
netstat -ano | findstr :3000
taskkill /F /PID <进程ID>
\`\`\`

---

## 📦 部署

### GitHub Pages 部署(已配置)

推送代码到 master 分支,GitHub Actions 自动部署:

\`\`\`bash
git push origin master
\`\`\`

访问: \`https://xuxikai886.github.io/touxiangdianzhaohaibaotiqu\`

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

---

## 📄 许可证

MIT License

---

<div align="center">

**⭐ 如果这个项目对你有帮助,请给个 Star!**

Made with ❤️ using Next.js 14

🤖 Generated with [Claude Code](https://claude.com/claude-code)

</div>

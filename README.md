# 美团外卖店铺图片监控系统

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

一个基于 Next.js 的实时监控系统,用于自动提取和展示美团外卖店铺的图片资源(头像、店招、海报)。

[功能特性](#-功能特性) • [技术栈](#️-技术栈) • [快速开始](#-快速开始) • [使用说明](#-使用说明) • [项目结构](#-项目结构)

</div>

---

## 📸 预览

本系统提供实时监控功能,自动检测 JSON 文件更新并提取店铺图片资源,支持批量下载和实时预览。

### 主要界面

- 🎯 **监控控制面板** - 一键启动/停止文件监控
- 🏪 **店铺信息展示** - 实时显示店铺名称、ID、更新时间
- 📋 **运行日志** - 彩色分类日志,实时追踪系统状态
- 🖼️ **图片预览区** - 店铺头像、店招、海报三合一展示
- 💾 **批量下载** - 一键下载所有图片资源

---

## ✨ 功能特性

### 核心功能

- ✅ **实时文件监控** - 每2秒自动检测 `latest_poi_food.json` 文件更新
- ✅ **智能数据解析** - 支持 `poi_info` 和 `poi_base_info` 两种 JSON 格式
- ✅ **图片自动提取** - 自动提取店铺头像、店招、海报图片
- ✅ **实时预览** - 图片加载完成后立即显示,支持多海报切换
- ✅ **批量下载** - 一键下载所有图片,自动以店铺名称命名
- ✅ **单张下载** - 每张图片支持独立下载按钮
- ✅ **自动清理** - 切换店铺时自动清空旧图片预览

### 用户体验

- 🎨 **现代化 UI** - 橙黄渐变主题,圆角设计,阴影效果
- 🌓 **深色模式** - 自动适配系统深色/浅色主题
- 📱 **响应式布局** - 完美支持桌面端和移动端
- 🔄 **实时日志** - 彩色分类日志(成功/错误/警告/信息)
- ⚡ **流畅动画** - 平滑过渡效果和悬停状态
- 🎯 **状态指示** - 实时显示监控运行状态

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
- **[class-variance-authority](https://cva.style/)** - CSS 变体管理
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Tailwind 类名合并工具

### 开发工具

- **ESLint** - 代码质量检查
- **PostCSS** - CSS 转换工具
- **Autoprefixer** - CSS 浏览器前缀自动添加

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0

### 安装步骤

#### 1. 克隆项目

```bash
git clone <your-repository-url>
cd meituan-image-monitor
```

#### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

#### 3. 配置 JSON 文件路径

默认监控文件路径为 `E:\美团外卖数据\latest_poi_food.json`。

如需修改,请编辑以下文件:

**`app/api/check-update/route.ts`**
```typescript
const jsonFilePath = path.join('E:', '美团外卖数据', 'latest_poi_food.json')
```

**`app/api/extract-images/route.ts`**
```typescript
const jsonFilePath = path.join('E:', '美团外卖数据', 'latest_poi_food.json')
```

#### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

服务器将在 [http://localhost:3000](http://localhost:3000) 启动。

#### 5. Windows 快速启动

双击 `start.bat` 文件,自动安装依赖并启动服务器。

---

## 📖 使用说明

### 配置 Fiddler 抓包

本系统需要配合 Fiddler 抓取美团外卖 APP 的接口数据。详细配置步骤请参考:

📄 **[提取店铺图片教程.md](提取店铺图片教程.md)**

### 启动监控流程

1. **启动 Fiddler** 并确保脚本配置正确
2. **启动本系统** (访问 http://localhost:3000)
3. **点击"开始监控"按钮**
4. **打开手机美团外卖 APP**,浏览不同店铺
5. **系统自动检测** JSON 文件更新并提取图片
6. **实时预览** 店铺头像、店招、海报
7. **下载图片** 使用批量下载或单张下载功能

### 功能操作指南

#### 监控控制

- **开始监控** 🟢 - 启动文件监控,每2秒检查一次文件更新
- **停止监控** 🔴 - 停止文件监控

#### 图片下载

- **批量下载** 📦 - 一键下载当前店铺的所有图片(头像+店招+所有海报)
- **单张下载** 💾 - 点击每张图片右上角的下载按钮单独下载

#### 日志查看

日志区域使用颜色区分不同类型:

- 🔵 **深灰色** - 一般信息
- 🟢 **绿色** - 成功操作
- 🟡 **黄色** - 警告信息
- 🔴 **红色** - 错误信息

---

## 📁 项目结构

```
meituan-image-monitor/
├── app/                          # Next.js App Router 目录
│   ├── api/                      # API 路由
│   │   ├── check-update/         # 文件更新检测 API
│   │   │   └── route.ts          # 检测 JSON 文件修改时间
│   │   └── extract-images/       # 图片提取 API
│   │       └── route.ts          # 解析 JSON 并提取图片 URL
│   ├── layout.tsx                # 根布局组件
│   ├── page.tsx                  # 主页面(监控界面)
│   ├── globals.css               # 全局样式(Tailwind + 自定义主题)
│   └── favicon.ico               # 网站图标
│
├── components/                   # React 组件
│   └── ui/                       # shadcn/ui 组件库
│       ├── button.tsx            # 按钮组件
│       ├── card.tsx              # 卡片组件
│       └── badge.tsx             # 徽章组件
│
├── lib/                          # 工具函数
│   └── utils.ts                  # 通用工具函数(cn 类名合并)
│
├── public/                       # 静态资源
│
├── .gitignore                    # Git 忽略配置
├── package.json                  # 项目依赖配置
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── postcss.config.mjs            # PostCSS 配置
├── next.config.ts                # Next.js 配置
├── components.json               # shadcn/ui 组件配置
├── start.bat                     # Windows 启动脚本
├── README.md                     # 项目说明文档
├── 使用说明.md                   # 详细使用教程
├── 项目迁移说明.md               # Python 到 Next.js 迁移文档
└── 提取店铺图片教程.md           # Fiddler 配置教程
```

### 核心文件说明

#### `app/page.tsx` - 主页面组件

核心功能实现:

- **状态管理** - 使用 React Hooks 管理监控状态、店铺信息、日志
- **文件监控** - setInterval 轮询检测文件更新
- **图片加载** - 动态加载状态管理,支持多图片预加载
- **下载功能** - Blob URL 下载实现,支持批量和单张下载
- **日志系统** - 彩色分类日志,自动滚动到底部

#### `app/api/check-update/route.ts` - 文件检测 API

```typescript
export async function GET() {
  const stats = fs.statSync(jsonFilePath)
  const currentModifiedTime = stats.mtimeMs
  const updated = currentModifiedTime > lastModifiedTime
  if (updated) lastModifiedTime = currentModifiedTime
  return NextResponse.json({ updated })
}
```

#### `app/api/extract-images/route.ts` - 图片提取 API

功能:
- 读取 JSON 文件
- 解析店铺信息(支持多种格式)
- 提取图片 URL 并去除尺寸参数
- 返回店铺名称、ID、图片 URL

#### `app/globals.css` - 自定义主题

橙黄渐变主题配置:
- 主色调: `--primary: 38 100% 50%` (橙色)
- 背景色: `--background: 45 100% 97%` (浅橙色)
- 圆角: `--radius: 1rem` (大圆角设计)

---

## 🎨 UI 设计特色

### 配色方案

采用温暖的橙黄渐变主题,灵感来自美团外卖品牌色:

- **主色调** - 橙色 (`hsl(38, 100%, 50%)`)
- **辅助色** - 黄色渐变
- **背景色** - 浅橙色渐变 (`from-orange-50 via-yellow-50`)
- **边框色** - 橙色 200 (`border-orange-200`)

### 设计元素

- **圆角设计** - 统一使用 `rounded-xl` (12px) 和 `rounded-2xl` (16px)
- **渐变背景** - 多处使用 `bg-gradient-to-br` 渐变效果
- **阴影效果** - `shadow-md` 和 `shadow-lg` 增加层次感
- **悬停动画** - 按钮和卡片的 `hover:` 状态过渡
- **图标装饰** - 每个区块使用渐变图标增强视觉

### 响应式布局

- **桌面端** - 左右两栏布局 (`lg:grid-cols-2`)
- **移动端** - 自动堆叠为单列
- **按钮** - 移动端自动全宽 (`w-full sm:w-auto`)

---

## 🔧 配置说明

### 修改监控文件路径

编辑 `app/api/check-update/route.ts` 和 `app/api/extract-images/route.ts`:

```typescript
// 修改为你的实际路径
const jsonFilePath = path.join('D:', 'your-folder', 'latest_poi_food.json')
```

### 修改轮询间隔

编辑 `app/page.tsx` 的 `startMonitoring` 函数:

```typescript
// 默认 2000ms (2秒),可修改为其他值
const interval = setInterval(async () => {
  // ...
}, 2000)
```

### 自定义主题颜色

编辑 `app/globals.css`:

```css
:root {
  --primary: 38 100% 50%;  /* 修改主色调 */
  --background: 45 100% 97%;  /* 修改背景色 */
}
```

---

## 📦 构建与部署

### 本地构建

```bash
npm run build
npm start
```

### Vercel 部署(推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动构建并部署
4. 获得生产环境 URL

**注意**: Vercel 部署后需要确保 JSON 文件路径可访问,或修改为 API 接口方式。

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

构建并运行:

```bash
docker build -t meituan-monitor .
docker run -p 3000:3000 -v /path/to/data:/data meituan-monitor
```

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署,推送到主分支即可。

**注意**: GitHub Pages 是静态托管,API 路由需要修改为客户端实现。

---

## 🔍 常见问题

### Q: 为什么没有检测到文件更新?

**A:** 请检查:
1. JSON 文件路径是否正确
2. Fiddler 是否正常运行并保存数据
3. 是否点击了"开始监控"按钮
4. 浏览器控制台是否有错误信息

### Q: 图片无法显示怎么办?

**A:** 可能原因:
1. 店铺确实没有该类型图片(部分店铺无店招或海报)
2. 图片 URL 访问受限(CORS 问题)
3. 网络连接问题

解决方案:
- 检查浏览器控制台网络请求
- 查看日志区域的错误信息
- 尝试直接访问图片 URL

### Q: 如何修改下载的文件名格式?

**A:** 编辑 `app/page.tsx` 的 `downloadImage` 函数调用:

```typescript
// 当前格式: 店铺名_头像.jpg
downloadImage(url, `${storeName}_头像.jpg`)

// 修改为其他格式,例如:
downloadImage(url, `avatar_${storeId}.jpg`)
```

### Q: 可以监控多个文件吗?

**A:** 可以,需要修改代码:
1. 在 API 路由中添加多文件检测逻辑
2. 在前端添加文件选择器
3. 维护多个 `lastModifiedTime` 状态

### Q: 如何添加更多图片类型?

**A:** 编辑 `app/api/extract-images/route.ts`:

1. 在 JSON 解析中添加新字段提取
2. 在返回值中添加新的 URL 字段
3. 在 `app/page.tsx` 中添加新的预览区域

---

## 🔍 API 接口文档

### GET /api/check-update

检查 JSON 文件是否有更新

**响应示例:**
```json
{
  "updated": true,
  "lastModified": "2024-01-01T12:00:00.000Z"
}
```

**参数说明:**
- `updated`: 布尔值,文件是否已更新
- `lastModified`: 字符串,最后修改时间

### GET /api/extract-images

提取店铺图片信息

**响应示例:**
```json
{
  "success": true,
  "storeName": "美味餐厅",
  "storeId": "123456789",
  "avatarUrl": "https://p0.meituan.net/xxx.jpg",
  "headerUrl": "https://p1.meituan.net/yyy.jpg",
  "posterUrls": [
    "https://p0.meituan.net/zzz1.jpg",
    "https://p0.meituan.net/zzz2.jpg"
  ]
}
```

**参数说明:**
- `success`: 布尔值,操作是否成功
- `storeName`: 字符串,店铺名称
- `storeId`: 字符串,店铺ID
- `avatarUrl`: 字符串,店铺头像URL(可选)
- `headerUrl`: 字符串,店铺店招URL(可选)
- `posterUrls`: 数组,店铺海报URL列表(可选)

---

## 🚧 未来改进计划

- [ ] **WebSocket 实时通信** - 替代轮询,更快响应
- [ ] **图片历史记录** - 保存历史数据,支持查看和对比
- [ ] **多店铺对比** - 同时展示多个店铺的图片
- [ ] **数据统计图表** - 添加店铺图片数量统计
- [ ] **用户认证系统** - 支持多用户登录和权限管理
- [ ] **云端图片存储** - 上传到云存储服务(OSS/S3)
- [ ] **图片压缩优化** - 下载前自动压缩图片
- [ ] **暗色/亮色切换** - 手动切换主题模式
- [ ] **移动端优化** - 改进移动端交互体验
- [ ] **批量导出 Excel** - 导出店铺信息和图片清单

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件命名使用 PascalCase
- 函数命名使用 camelCase
- 添加适当的注释和类型定义

---

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

---

## 📝 环境变量

创建 `.env.local` 文件(可选):

```env
# 自定义配置
NEXT_PUBLIC_JSON_FILE_PATH=/path/to/latest_poi_food.json
```

---

## 📄 许可证

本项目采用 MIT 协议开源。详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 高效的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的组件库
- [Lucide](https://lucide.dev/) - 开源图标库
- 原 Python 项目提供的核心业务逻辑

---

## 📞 联系方式

如有问题或建议,欢迎联系:

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: your-email@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助,请给个 Star!**

Made with ❤️ using Next.js

</div>

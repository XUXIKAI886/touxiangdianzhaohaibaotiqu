# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

这是一个基于 Next.js 14 的美团外卖店铺图片提取系统,使用**浏览器本地存储**技术,用户上传 Fiddler 抓取的 JSON 文件后,自动提取和展示店铺图片资源(头像、店招、海报)。项目已配置为纯静态网站,部署在 GitHub Pages 上。

## 核心架构变更 (v2.0 - 本地存储版)

### 架构演进

- **v1.0 (旧版)**: Node.js API 路由 + 本地文件监控
- **v2.0 (当前)**: 纯前端静态网站 + 浏览器 localStorage

### 关键技术栈

- **前端框架**: Next.js 14 (静态导出模式)
- **数据存储**: localStorage (浏览器本地存储)
- **部署方式**: GitHub Actions + GitHub Pages
- **UI 组件**: shadcn/ui + Tailwind CSS

## 常用开发命令

### 🔧 启动开发服务器(必须遵循的三步流程)

**每次启动前必须执行端口检查,防止端口占用冲突:**

```bash
# 第一步: 检查 3000 端口占用
netstat -ano | findstr :3000

# 第二步: 如果端口被占用,强制终止进程
taskkill /F /PID <进程ID>

# 第三步: 启动开发服务器
npm run dev
```

### 本地开发

```bash
npm run dev        # 启动开发服务器 (http://localhost:3000)
npm run build      # 构建静态网站到 out 目录
npm run lint       # 运行 ESLint 代码检查
```

### 静态网站预览

```bash
npm run build      # 先构建
npx serve out      # 预览 out 目录(需要全局安装 serve: npm i -g serve)
```

### Windows 快速启动

```bash
start.bat          # 自动安装依赖并启动开发服务器
```

## 核心功能说明

### 1. JSON 文件上传处理

**实现位置**: `app/page.tsx:87-107`

用户通过文件选择器上传 Fiddler 抓取的 JSON 文件:

```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string)
    processJsonData(data)
  }
  reader.readAsText(file)
}
```

### 2. 数据解析与提取

**实现位置**: `app/page.tsx:110-208`

核心解析逻辑:
- 兼容 `poi_info` 和 `poi_base_info` 两种 JSON 格式
- 提取头像、店招、海报图片 URL
- 使用 `removeSizeParams` 函数去除美团图片尺寸参数,获取原图
- 过滤粉丝群海报 (`fans_group_poster`)

**关键代码**:
```typescript
// 移除美团图片URL的尺寸参数
const removeSizeParams = (url: string): string => {
  return url.replace(/@\d+w_\d+h_\d+e_\d+c/g, '')
}

// 过滤粉丝群海报
if (picUrl && !picUrl.includes('fans_group_poster')) {
  posterUrls.push(picUrl.split('?')[0])
}
```

### 3. 本地存储管理

**实现位置**: `app/page.tsx:25-26, 39-63, 174-180`

使用两个 localStorage 键:
- `meituan_store_data`: 当前店铺数据
- `meituan_store_history`: 历史记录(最多保存 10 条)

```typescript
const STORAGE_KEY = 'meituan_store_data'
const HISTORY_KEY = 'meituan_store_history'

// 保存当前数据
localStorage.setItem(STORAGE_KEY, JSON.stringify(storeInfo))

// 保存历史记录(去重 + 限制数量)
const newHistory = [
  newStoreInfo,
  ...storeHistory.filter(item => item.id !== storeId)
].slice(0, 10)
localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
```

### 4. 图片下载功能

**实现位置**: `app/page.tsx:219-264`

使用 Blob URL 实现客户端下载:

```typescript
const downloadImage = async (url: string, filename: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  link.click()

  window.URL.revokeObjectURL(blobUrl)
}
```

**批量下载逻辑**:
- 自动生成文件名: `店铺名_头像.jpg`, `店铺名_店招.jpg`, `店铺名_海报1.jpg`
- 非法字符替换: `店铺名.replace(/[<>:"/\\|?*]/g, '_')`

### 5. 历史记录功能

**实现位置**: `app/page.tsx:285-292, 397-429`

特性:
- 最多保存 10 条历史记录
- 自动去重(相同店铺 ID 只保留最新)
- 点击历史记录快速加载
- 支持清空所有历史

## 项目配置文件说明

### next.config.js

**关键配置**:

```javascript
const nextConfig = {
  output: 'export',                    // 静态导出模式
  images: { unoptimized: true },      // 禁用图片优化(静态导出需要)
  basePath: '/touxiangdianzhaohaibaotiqu',  // GitHub Pages 子路径
  assetPrefix: '/touxiangdianzhaohaibaotiqu' // 静态资源前缀
}
```

**注意事项**:
- `basePath` 和 `assetPrefix` 必须与 GitHub 仓库名一致
- 生产环境自动应用,开发环境自动忽略
- 修改仓库名后需要同步更新这两个配置

### .github/workflows/deploy.yml

**GitHub Actions 自动部署流程**:

1. **触发条件**: 推送到 `master` 分支
2. **构建流程**:
   - 检出代码
   - 安装 Node.js 20
   - 安装依赖 (`npm ci`)
   - 构建静态网站 (`npm run build`)
   - 上传 `out` 目录到 GitHub Pages
3. **部署**: 自动部署到 `https://<username>.github.io/touxiangdianzhaohaibaotiqu`

**权限要求**:
- `contents: read` - 读取仓库内容
- `pages: write` - 写入 GitHub Pages
- `id-token: write` - 验证身份令牌

### public/.nojekyll

**作用**: 告诉 GitHub Pages 不要使用 Jekyll 处理静态文件,避免 `_next` 目录被忽略。

## 部署流程

### 首次部署设置

1. **启用 GitHub Pages**:
   - 进入仓库 Settings → Pages
   - Source 选择: `GitHub Actions`

2. **推送代码**:
   ```bash
   git add .
   git commit -m "部署静态版本到 GitHub Pages"
   git push origin master
   ```

3. **查看部署状态**:
   - 进入仓库 Actions 标签
   - 等待部署完成(约 2-3 分钟)
   - 访问: `https://<username>.github.io/touxiangdianzhaohaibaotiqu`

### 后续更新部署

每次推送到 `master` 分支后,GitHub Actions 自动触发构建和部署:

```bash
git add .
git commit -m "更新功能"
git push origin master
```

## 日志系统

**实现位置**: `app/page.tsx:65-78, 210-217`

日志分类:
- `info` (深灰色): 一般信息
- `success` (绿色): 成功操作
- `warning` (黄色): 警告信息
- `error` (红色): 错误信息

日志自动滚动到底部,通过 `useRef` + `scrollIntoView` 实现。

## 代码质量与架构规范

### 文件规模控制

当前项目完全符合架构规范:
- ✅ `app/page.tsx`: ~590 行(包含完整的客户端逻辑)
- ✅ `next.config.js`: 25 行
- ✅ `.github/workflows/deploy.yml`: 59 行
- ✅ 每个目录文件数 ≤ 8 个

### 已消除的代码坏味道

相比 v1.0,v2.0 已解决:
1. ✅ **重复配置**: 移除了 API 路由中的重复路径配置
2. ✅ **全局状态**: 使用 localStorage 替代 `window` 全局变量
3. ✅ **循环依赖**: 移除了前后端之间的轮询依赖

### 当前架构优势

1. **无服务器依赖**: 完全静态化,无需后端服务器
2. **数据隐私**: 所有数据存储在用户本地浏览器
3. **部署简单**: 自动部署到 GitHub Pages,零成本
4. **离线可用**: 构建后的静态文件支持离线访问

### 未来优化方向

如果 `app/page.tsx` 继续增长,建议拆分为:
- `components/FileUploader.tsx` - 文件上传组件
- `components/StoreInfo.tsx` - 店铺信息展示
- `components/ImageGallery.tsx` - 图片预览组件
- `components/HistoryList.tsx` - 历史记录组件
- `hooks/useLocalStorage.ts` - 本地存储 Hook
- `utils/jsonParser.ts` - JSON 解析工具

## 调试建议

### 本地构建测试

```bash
# 构建静态网站
npm run build

# 检查 out 目录
ls out

# 本地预览(需要安装 serve)
npx serve out
```

访问 `http://localhost:3000` 测试静态网站。

### GitHub Actions 失败排查

1. **查看构建日志**:
   - 进入 Actions 标签
   - 点击失败的工作流
   - 查看详细日志

2. **常见问题**:
   - **Node.js 版本不匹配**: 确认 `.github/workflows/deploy.yml` 中的 Node 版本与本地一致
   - **依赖安装失败**: 检查 `package-lock.json` 是否提交
   - **构建失败**: 本地运行 `npm run build` 排查错误
   - **权限不足**: 确认仓库 Settings → Actions → General → Workflow permissions 设置为 `Read and write permissions`

### localStorage 调试

```javascript
// 浏览器控制台查看存储数据
console.log(localStorage.getItem('meituan_store_data'))
console.log(localStorage.getItem('meituan_store_history'))

// 清空存储数据
localStorage.clear()
```

### basePath 配置问题

如果部署后页面样式丢失或资源 404:

1. **检查 next.config.js**: 确认 `basePath` 与仓库名一致
2. **检查访问 URL**: 必须包含 basePath,例如:
   - ✅ `https://username.github.io/touxiangdianzhaohaibaotiqu/`
   - ❌ `https://username.github.io/`

3. **修复方法**:
   ```javascript
   // 如果仓库名改为 image-extractor
   basePath: '/image-extractor'
   assetPrefix: '/image-extractor'
   ```

## 与 Fiddler 配合使用

### 数据获取流程

1. **配置 Fiddler 抓包** (参考 `提取店铺图片教程.md`)
2. **手机美团 APP** 浏览店铺页面
3. **Fiddler 拦截并保存** JSON 响应到本地
4. **打开本系统** (`https://<username>.github.io/touxiangdianzhaohaibaotiqu`)
5. **点击"上传 JSON 文件"** 选择保存的 JSON
6. **自动提取并展示** 店铺图片
7. **批量下载** 所需图片

### JSON 文件格式兼容性

系统兼容两种美团 API 响应格式:

**格式 1**: 使用 `poi_info`
```json
{
  "data": {
    "poi_info": {
      "name": "店铺名称",
      "poi_id_str": "123456",
      "pic_url": "头像URL",
      "head_pic_url": "店招URL"
    }
  }
}
```

**格式 2**: 使用 `poi_base_info`
```json
{
  "data": {
    "poi_base_info": {
      "name": "店铺名称",
      "poi_id_str": "123456",
      "pic_url": "头像URL"
    }
  }
}
```

系统会自动检测并使用可用的格式。

## 技术细节

### 美团图片 URL 处理

美团图片 URL 包含尺寸参数(如 `@100w_100h_1e_1c`),系统会自动移除以获取原图:

```typescript
// 原始 URL
https://p0.meituan.net/xxx@100w_100h_1e_1c.jpg

// 处理后 URL (原图)
https://p0.meituan.net/xxx.jpg
```

### 文件名安全处理

下载图片时,店铺名称中的非法字符会被替换为下划线:

```typescript
const storeName = storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')
```

**示例**:
- 店铺名: `张三的餐厅<总店>`
- 文件名: `张三的餐厅_总店__头像.jpg`

### localStorage 限制

- **容量限制**: 约 5-10MB (不同浏览器略有差异)
- **数据类型**: 只能存储字符串(使用 JSON.stringify/parse 序列化)
- **持久性**: 数据永久保存,除非用户手动清除
- **作用域**: 同源策略限制(协议+域名+端口相同)

## 未来扩展方向

- **拖拽上传**: 支持拖放 JSON 文件到页面
- **批量上传**: 一次上传多个 JSON 文件
- **数据导出**: 导出历史记录为 Excel 或 CSV
- **云端同步**: 使用 IndexedDB 或云存储服务
- **图片预加载**: 提升多张海报的显示速度
- **PWA 支持**: 添加离线缓存和桌面安装
- **暗色主题切换**: 手动切换深色/浅色模式

## 常见问题 FAQ

### Q: 上传 JSON 文件后没有反应?

A: 检查:
1. JSON 文件格式是否正确(使用 JSON 验证工具)
2. 浏览器控制台是否有错误信息
3. 文件是否包含 `data.poi_info` 或 `data.poi_base_info` 字段

### Q: 图片无法下载?

A: 可能原因:
1. 图片 URL 已失效(美团定期清理图片)
2. 网络连接问题
3. 浏览器阻止了跨域请求(CORS)

### Q: 历史记录丢失?

A: localStorage 数据可能被清除:
1. 用户手动清除浏览器数据
2. 浏览器隐私模式(无痕模式)
3. 浏览器存储空间不足

### Q: GitHub Pages 部署后访问 404?

A: 检查:
1. 仓库 Settings → Pages 是否已启用
2. Actions 工作流是否成功执行
3. 访问 URL 是否包含正确的 basePath

### Q: 本地开发正常,部署后样式丢失?

A: 检查 `next.config.js` 中的 `basePath` 配置是否与仓库名一致。

---

> 🎯 **项目目标**: 轻量级、纯静态、零成本的美团店铺图片提取工具
> 📋 **架构原则**: 无服务器、数据本地化、自动化部署

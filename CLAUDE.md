# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目简介

这是一个基于 Next.js 14 的美团外卖店铺图片监控系统,用于自动提取和展示美团外卖店铺的图片资源(头像、店招、海报)。项目配合 Fiddler 抓包工具使用,从移动端 APP 的 API 响应中提取店铺图片数据。

## 常用开发命令

### 本地开发
```bash
npm run dev        # 启动开发服务器 (http://localhost:3000)
npm run build      # 构建生产版本
npm start          # 启动生产服务器
npm run lint       # 运行 ESLint 代码检查
```

### Windows 快速启动
```bash
start.bat          # 自动安装依赖并启动开发服务器
```

## 核心架构说明

### 前后端分离的轮询监控架构

项目采用前端轮询 + 服务端 API 的架构模式:

1. **文件监控机制**:
   - 前端每 2 秒轮询 `/api/check-update` 检测 JSON 文件是否更新
   - API 路由通过比较 `fs.statSync().mtimeMs` 判断文件修改时间
   - 使用模块级变量 `lastModifiedTime` 持久化上次检测时间

2. **数据提取流程**:
   - 检测到更新后,前端调用 `/api/extract-images` 提取图片数据
   - API 路由解析 JSON 文件,兼容 `poi_info` 和 `poi_base_info` 两种格式
   - 通过正则表达式 `/@\d+w_\d+h_\d+e_\d+c/g` 移除美团图片 URL 的尺寸参数,获取原图

3. **状态管理模式**:
   - 使用 React Hooks 管理监控状态、店铺信息、日志记录
   - 独立管理每种图片的加载状态 (`avatarLoaded`, `headerLoaded`, `posterLoaded`)
   - 切换店铺时主动清空旧图片预览状态

### 关键技术实现

#### JSON 文件路径配置
监控文件路径在两个 API 路由中硬编码:
- `app/api/check-update/route.ts:10`
- `app/api/extract-images/route.ts:40`

默认路径: `path.join(process.cwd(), '..', 'latest_poi_food.json')`
实际位置: `E:\美团外卖数据\latest_poi_food.json`

**修改路径时必须同时更新两个文件**,否则会导致监控和提取功能不一致。

#### 图片 URL 处理逻辑
美团图片 URL 包含尺寸参数(如 `@100w_100h_1e_1c`),需要移除以获取原图:
```typescript
function removeSizeParams(url: string): string {
  return url.replace(/@\d+w_\d+h_\d+e_\d+c/g, '')
}
```

#### 海报过滤规则
在 `app/api/extract-images/route.ts:91` 中,自动过滤掉粉丝群海报:
```typescript
if (picUrl && !picUrl.includes('fans_group_poster')) {
  posterUrls.push(picUrl.split('?')[0])
}
```

#### 图片下载实现
使用 Blob URL 实现客户端下载:
```typescript
const response = await fetch(url)
const blob = await response.blob()
const blobUrl = window.URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = blobUrl
link.download = filename
link.click()
window.URL.revokeObjectURL(blobUrl)
```

### 日志系统设计

日志使用彩色分类显示:
- `info`: 深灰色 - 一般信息(检测更新、下载进度)
- `success`: 绿色 - 成功操作(店铺处理完成、下载成功)
- `warning`: 黄色 - 警告信息(无海报、监控停止)
- `error`: 红色 - 错误信息(文件读取失败、下载失败)

日志自动滚动到底部,通过 `useRef` + `scrollIntoView` 实现。

## 项目特殊配置

### Next.js 图片域名白名单
在 `next.config.js` 中配置了美团图片域名:
- `p0.meituan.net`
- `p1.meituan.net`
- `s3plus-img.sankuai.com`

如需使用 Next.js Image 组件,必须在此配置白名单。

### Tailwind 主题定制
在 `app/globals.css` 中使用橙黄渐变主题:
- 主色调: `--primary: 38 100% 50%` (橙色)
- 背景色: `--background: 45 100% 97%` (浅橙色)
- 圆角: `--radius: 1rem`

### shadcn/ui 组件库
项目使用了 shadcn/ui 的以下组件:
- `Button`, `Card`, `Badge` (位于 `components/ui/`)
- 通过 `lib/utils.ts` 的 `cn()` 函数合并 Tailwind 类名

## 依赖 Fiddler 的数据流

1. 用户在手机美团 APP 中浏览店铺
2. Fiddler 拦截 API 请求并保存 JSON 响应到 `latest_poi_food.json`
3. 本系统监控文件变化并自动提取图片
4. 前端实时显示图片预览和下载功能

**注意**: 系统不直接调用美团 API,完全依赖 Fiddler 生成的本地 JSON 文件。

## 调试建议

### 文件监控不工作
1. 检查 JSON 文件路径是否正确(两个 API 路由)
2. 确认 Fiddler 脚本正确保存文件
3. 查看浏览器控制台 Network 标签,确认 `/api/check-update` 返回 `updated: true`

### 图片无法显示
1. 检查浏览器控制台是否有 CORS 错误
2. 确认图片 URL 是否有效(直接在浏览器访问测试)
3. 查看日志区域的错误信息

### API 路由错误
1. 检查 Next.js 服务器终端日志
2. 确认 JSON 文件格式是否正确(使用 JSON 验证工具)
3. 测试 API 路由: `curl http://localhost:3000/api/extract-images`

## 未来扩展方向

- **WebSocket 替代轮询**: 使用 Socket.IO 实现服务端主动推送更新
- **数据持久化**: 使用 SQLite 或 PostgreSQL 存储历史记录
- **多文件监控**: 支持同时监控多个 JSON 文件
- **用户认证**: 添加 NextAuth.js 实现多用户权限管理

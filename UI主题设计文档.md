# UI 主题设计文档

## 📋 文档说明

本文档详细记录了美团外卖店铺图片监控系统的 UI 设计规范,包括配色方案、组件样式、布局规则等。使用本文档可以完整复现项目的视觉设计。

**技术栈:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3.4
- shadcn/ui
- Lucide React

---

## 🎨 设计理念

### 核心设计思想

- **温暖友好** - 使用橙黄渐变色,营造温暖、积极的氛围
- **现代简洁** - 大圆角设计,简洁的卡片布局
- **层次分明** - 通过阴影和渐变营造视觉深度
- **响应迅速** - 流畅的过渡动画和悬停效果

### 设计风格

- 扁平化设计 + 轻微拟物化(阴影)
- 圆角卡片设计
- 渐变色装饰
- 柔和的配色
- 清晰的信息层级

---

## 🌈 配色方案

### 主色调 (Primary Colors)

```css
/* 橙色 - 主色调 */
--primary: 38 100% 50%;           /* hsl(38, 100%, 50%) = #FF9500 */
--primary-foreground: 0 0% 100%;  /* 白色文字 */

/* 橙色变体 */
Orange-50:  hsl(45, 100%, 97%)    /* #FFFBF0 - 极浅橙 */
Orange-100: hsl(45, 100%, 94%)    /* #FFF3CC - 浅橙 */
Orange-200: hsl(45, 90%, 85%)     /* #FFE4A0 - 中浅橙 */
Orange-300: hsl(40, 100%, 75%)    /* #FFCC66 - 中橙 */
Orange-400: hsl(38, 100%, 60%)    /* #FFB84D - 亮橙 */
Orange-500: hsl(38, 100%, 50%)    /* #FF9500 - 标准橙 (主色) */
Orange-600: hsl(36, 100%, 45%)    /* #E68600 - 深橙 */
Orange-700: hsl(35, 90%, 40%)     /* #CC7700 - 更深橙 */
```

### 辅助色 (Secondary Colors)

```css
/* 黄色 - 辅助色 */
--secondary: 45 100% 94%;         /* hsl(45, 100%, 94%) */
--secondary-foreground: 30 20% 20%; /* 深灰色文字 */

/* 黄色变体 */
Yellow-50:  hsl(50, 100%, 97%)    /* #FFFFEF - 极浅黄 */
Yellow-100: hsl(48, 100%, 92%)    /* #FFF9CC - 浅黄 */
Yellow-200: hsl(46, 100%, 85%)    /* #FFEB99 - 中浅黄 */
Yellow-300: hsl(45, 100%, 75%)    /* #FFDD66 - 中黄 */
Yellow-400: hsl(44, 100%, 60%)    /* #FFCC33 - 亮黄 */
```

### 背景色 (Background Colors)

```css
/* 浅色模式背景 */
--background: 45 100% 97%;        /* #FFFBF0 - 温暖的白色 */

/* 渐变背景 */
bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50
/* 从浅橙 -> 浅黄 -> 浅橙的对角渐变 */

/* 卡片背景 */
--card: 0 0% 100%;                /* #FFFFFF - 纯白 */
```

### 暗色模式配色

```css
/* 暗色背景 */
--background: 30 15% 8%;          /* #140F0A - 深棕黑 */

/* 暗色卡片 */
--card: 30 20% 12%;               /* #251A13 - 深棕 */

/* 暗色主色调 */
--primary: 38 100% 55%;           /* #FFB84D - 亮橙 */

/* 暗色渐变背景 */
dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
```

### 语义化颜色

```css
/* 成功 - 绿色 */
Success Light: text-green-600     /* #16A34A */
Success Dark:  text-green-400     /* #4ADE80 */

/* 错误 - 红色 */
Error Light: text-red-600         /* #DC2626 */
Error Dark:  text-red-400         /* #F87171 */

/* 警告 - 黄色 */
Warning Light: text-yellow-700    /* #A16207 */
Warning Dark:  text-yellow-400    /* #FACC15 */

/* 信息 - 灰色 */
Info Light: text-gray-700         /* #374151 */
Info Dark:  text-gray-300         /* #D1D5DB */
```

### 文字颜色

```css
/* 主要文字 */
--foreground: 30 20% 20%;         /* #3D342B - 深棕灰 */

/* 次要文字 */
text-gray-600                     /* #4B5563 */
text-gray-500                     /* #6B7280 */

/* 占位符文字 */
text-gray-400                     /* #9CA3AF */
```

### 边框颜色

```css
/* 浅色模式边框 */
--border: 45 30% 85%;             /* #E8DCC8 - 浅橙灰 */
border-orange-200                 /* #FED7AA */
border-orange-100                 /* #FFEDD5 */

/* 暗色模式边框 */
dark:border-slate-800             /* #1E293B */
dark:border-slate-700             /* #334155 */
```

---

## 📐 间距系统 (Spacing)

### Tailwind 间距对照表

```
0   = 0px
0.5 = 2px
1   = 4px
1.5 = 6px
2   = 8px
2.5 = 10px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
7   = 28px
8   = 32px
10  = 40px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
```

### 常用间距规范

```css
/* 组件内边距 */
Card Padding:     p-4 (16px) 或 p-6 (24px)
Button Padding:   px-4 py-2 (水平16px, 垂直8px)
Input Padding:    px-3 py-2 (水平12px, 垂直8px)

/* 组件外边距 */
Section Margin:   mb-6 (24px)
Element Margin:   mb-3, mb-4 (12px, 16px)

/* 组件间距 */
Grid Gap:         gap-6 (24px)
Stack Space:      space-y-4, space-y-6 (16px, 24px)
Flex Gap:         gap-3 (12px)
```

---

## 🔤 字体系统 (Typography)

### 字体族

```css
/* 系统字体栈 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;

/* 等宽字体 (日志) */
font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
           "Liberation Mono", monospace;
```

### 字体大小

```css
/* 标题 */
text-2xl:  24px / 32px line-height  /* 页面主标题 */
text-xl:   20px / 28px line-height  /* 卡片标题 */
text-lg:   18px / 28px line-height  /* 二级标题 */

/* 正文 */
text-base: 16px / 24px line-height  /* 默认正文 */
text-sm:   14px / 20px line-height  /* 小号文字 */
text-xs:   12px / 16px line-height  /* 辅助信息 */
```

### 字体粗细

```css
font-normal:    400  /* 普通文字 */
font-medium:    500  /* 次要强调 */
font-semibold:  600  /* 强调文字 */
font-bold:      700  /* 标题 */
```

### 字体使用规范

```tsx
/* 页面主标题 */
<h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
  美团外卖店铺图片监控
</h1>

/* 卡片标题 */
<h2 className="text-lg font-bold text-gray-800 dark:text-white">
  店铺信息
</h2>

/* 标签文字 */
<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
  店铺名称
</span>

/* 内容文字 */
<span className="text-sm text-gray-700 dark:text-gray-300">
  等待数据...
</span>

/* 辅助文字 */
<span className="text-xs text-gray-500 dark:text-gray-400">
  最后更新时间
</span>
```

---

## 🔘 圆角系统 (Border Radius)

### 全局圆角配置

```css
--radius: 1rem;  /* 16px - 主要圆角大小 */
```

### 圆角规范

```css
/* 大圆角 - 卡片 */
rounded-2xl:  16px  /* 主要卡片 */
rounded-xl:   12px  /* 次要元素、图片容器 */

/* 中圆角 - 按钮、输入框 */
rounded-lg:   8px   /* 按钮 */
rounded-md:   6px   /* 小按钮 */

/* 小圆角 - 标签 */
rounded:      4px   /* 默认圆角 */

/* 完全圆角 - 徽章 */
rounded-full: 9999px  /* 圆形徽章 */
```

### 使用示例

```tsx
/* 卡片 */
<Card className="rounded-2xl">

/* 按钮 */
<Button className="rounded-xl">

/* 图片容器 */
<div className="rounded-xl overflow-hidden">

/* 徽章 */
<Badge className="rounded-full">
```

---

## 🎭 阴影系统 (Shadows)

### 阴影层级

```css
/* 轻微阴影 - 悬浮卡片 */
shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)

/* 标准阴影 - 卡片 */
shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1)

/* 加深阴影 - 按钮悬停 */
shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1)
```

### 阴影使用规范

```tsx
/* 卡片默认阴影 */
<Card className="shadow-md">

/* 悬停增强阴影 */
<Card className="shadow-md hover:shadow-lg transition-shadow">

/* 按钮阴影 */
<Button className="shadow-md hover:shadow-lg">
```

---

## 🎨 渐变系统 (Gradients)

### 渐变方向

```css
bg-gradient-to-r:   从左到右
bg-gradient-to-l:   从右到左
bg-gradient-to-t:   从下到上
bg-gradient-to-b:   从上到下
bg-gradient-to-br:  从左上到右下 (最常用)
bg-gradient-to-bl:  从右上到左下
```

### 常用渐变配置

```tsx
/* 页面背景渐变 */
className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50"

/* 标题文字渐变 */
className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent"

/* 图标背景渐变 */
className="bg-gradient-to-br from-orange-400 to-yellow-400"

/* 卡片内部装饰渐变 */
className="bg-gradient-to-br from-orange-50/50 to-yellow-50/50"
```

### 渐变透明度

```css
/* 50% 透明度 */
from-orange-50/50

/* 30% 透明度 */
hover:bg-orange-100/30
```

---

## 🧩 核心组件样式

### 1. Card (卡片)

#### 基础卡片样式

```tsx
<Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
      标题
    </CardTitle>
    <CardDescription className="text-gray-600 dark:text-gray-400">
      描述文字
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* 内容 */}
  </CardContent>
</Card>
```

#### 带图标的卡片标题

```tsx
<CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center mr-2">
    <Store className="w-5 h-5 text-white" />
  </div>
  店铺信息
</CardTitle>
```

### 2. Button (按钮)

#### 主要按钮 (开始监控)

```tsx
<Button
  size="lg"
  variant="default"
  className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
>
  <Play className="w-4 h-4 mr-2" />
  开始监控
</Button>
```

#### 危险按钮 (停止监控)

```tsx
<Button
  size="lg"
  variant="destructive"
  className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
>
  <Square className="w-4 h-4 mr-2" />
  停止监控
</Button>
```

#### 轮廓按钮 (批量下载)

```tsx
<Button
  size="lg"
  variant="outline"
  className="w-full sm:w-auto rounded-xl border-2 border-orange-300 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-950 transition-all font-semibold"
>
  <Download className="w-4 h-4 mr-2" />
  批量下载图片
</Button>
```

#### 幽灵按钮 (小下载按钮)

```tsx
<Button
  size="sm"
  variant="ghost"
  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg h-7"
>
  <Download className="w-3.5 h-3.5" />
</Button>
```

### 3. Badge (徽章)

#### 状态徽章

```tsx
/* 运行中 */
<Badge variant="default" className="px-4 py-1.5 rounded-full text-sm font-medium">
  🟢 运行中
</Badge>

/* 未启动 */
<Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm font-medium">
  ⚪ 未启动
</Badge>
```

#### 数量徽章

```tsx
<span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded-full">
  3张
</span>
```

### 4. 图片容器

#### 标准图片容器

```tsx
<div className="h-56 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-2 border-orange-100 dark:border-slate-800">
  {imageLoaded ? (
    <img
      src={imageUrl}
      alt="描述"
      className="w-full h-full object-contain p-2"
    />
  ) : (
    <span className="text-gray-400 dark:text-gray-600 text-sm">暂无图片</span>
  )}
</div>
```

#### 不同尺寸的图片容器

```tsx
/* 店铺头像容器 - 高 224px */
<div className="h-56 ...">

/* 店铺店招容器 - 高 208px */
<div className="h-52 ...">

/* 店铺海报容器 - 高 256px */
<div className="h-64 ...">
```

### 5. 日志容器

```tsx
<div className="h-[600px] overflow-y-auto bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-4 font-mono text-sm border border-orange-100 dark:border-slate-800">
  {logs.length === 0 && (
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
      暂无日志记录
    </div>
  )}
  {logs.map((log, index) => (
    <div
      key={index}
      className="text-green-600 dark:text-green-400 mb-1 hover:bg-orange-100/30 dark:hover:bg-slate-800/30 px-2 py-0.5 rounded transition-colors"
    >
      <span className="text-gray-600 dark:text-gray-400">[{log.timestamp}]</span> {log.message}
    </div>
  ))}
</div>
```

---

## 📱 响应式设计

### 断点系统

```css
/* Tailwind 默认断点 */
sm:  640px   /* 小屏幕 (手机横屏) */
md:  768px   /* 中等屏幕 (平板竖屏) */
lg:  1024px  /* 大屏幕 (平板横屏、小笔记本) */
xl:  1280px  /* 超大屏幕 (桌面显示器) */
2xl: 1536px  /* 2K 屏幕 */
```

### 响应式布局规范

#### 容器宽度

```tsx
/* 全局容器 */
<div className="container mx-auto px-4 py-6">
  /* 内容 */
</div>

/* container 在不同断点的最大宽度:
   sm: 640px
   md: 768px
   lg: 1024px
   xl: 1280px
   2xl: 1536px
*/
```

#### 网格布局

```tsx
/* 双栏布局(桌面端) */
<div className="grid lg:grid-cols-2 gap-6">
  <div>{/* 左栏 */}</div>
  <div>{/* 右栏 */}</div>
</div>

/* 小屏幕: 1列
   lg及以上: 2列
   列间距: 24px
*/
```

#### 按钮响应式

```tsx
/* 移动端全宽,桌面端自适应 */
<Button className="w-full sm:w-auto">
  按钮文字
</Button>
```

#### Flex 方向响应式

```tsx
/* 移动端垂直排列,桌面端水平排列 */
<div className="flex flex-col sm:flex-row gap-3">
  {/* 内容 */}
</div>
```

---

## 🎬 动画与过渡

### 过渡配置

```css
/* 标准过渡 */
transition-all       /* 所有属性过渡 */
transition-colors    /* 颜色过渡 */
transition-shadow    /* 阴影过渡 */
transition-transform /* 变换过渡 */

/* 过渡时长 */
duration-150  /* 150ms - 快速 */
duration-300  /* 300ms - 标准 (默认) */
duration-500  /* 500ms - 慢速 */
```

### 常用过渡效果

```tsx
/* 阴影过渡 */
<Card className="shadow-md hover:shadow-lg transition-shadow">

/* 颜色过渡 */
<div className="bg-orange-50 hover:bg-orange-100 transition-colors">

/* 综合过渡 */
<Button className="transition-all hover:scale-105">
```

### 悬停效果

```tsx
/* 卡片悬停 */
<Card className="hover:shadow-lg transition-shadow">

/* 按钮悬停 */
<Button className="hover:bg-orange-600 transition-colors">

/* 日志行悬停 */
<div className="hover:bg-orange-100/30 transition-colors">

/* 图标悬停 */
<div className="hover:scale-110 transition-transform">
```

---

## 🎯 布局模式

### 1. 页面整体布局

```tsx
<div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
  {/* Header */}
  <header className="bg-white/80 backdrop-blur-md border-b border-orange-200 shadow-sm">
    {/* 导航内容 */}
  </header>

  {/* Main Content */}
  <main className="container mx-auto px-4 py-6">
    {/* 主要内容 */}
  </main>
</div>
```

### 2. 导航栏布局

```tsx
<header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-orange-200 dark:border-slate-800 shadow-sm">
  <div className="container mx-auto px-4 py-5">
    <div className="flex items-center justify-between">
      {/* 左侧 Logo 和标题 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Store className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
          美团外卖店铺图片监控
        </h1>
      </div>

      {/* 右侧状态徽章 */}
      <Badge variant="default" className="px-4 py-1.5 rounded-full">
        🟢 运行中
      </Badge>
    </div>
  </div>
</header>
```

### 3. 双栏内容布局

```tsx
<div className="grid lg:grid-cols-2 gap-6">
  {/* 左栏 */}
  <div className="space-y-6">
    <Card>{/* 店铺信息 */}</Card>
    <Card>{/* 运行日志 */}</Card>
  </div>

  {/* 右栏 */}
  <div className="space-y-6">
    <Card>{/* 图片预览 */}</Card>
  </div>
</div>
```

### 4. 垂直堆叠布局

```tsx
<div className="space-y-6">
  <Card>{/* 卡片1 */}</Card>
  <Card>{/* 卡片2 */}</Card>
  <Card>{/* 卡片3 */}</Card>
</div>

/* space-y-6 在子元素之间添加 24px 的垂直间距 */
```

### 5. 水平排列布局

```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button>{/* 按钮1 */}</Button>
  <Button>{/* 按钮2 */}</Button>
</div>

/* 移动端: 垂直排列 (flex-col)
   桌面端: 水平排列 (sm:flex-row)
   间距: 12px (gap-3)
*/
```

---

## 🖼️ 图标使用规范

### 图标库

使用 **Lucide React** 图标库

```bash
npm install lucide-react
```

### 图标导入

```tsx
import {
  Play,
  Square,
  Download,
  Store,
  Image as ImageIcon
} from 'lucide-react'
```

### 图标尺寸

```tsx
/* 小图标 - 按钮内 */
<Download className="w-3.5 h-3.5" />  /* 14px */

/* 标准图标 - 按钮内 */
<Play className="w-4 h-4" />           /* 16px */

/* 中等图标 - 导航栏 */
<Store className="w-5 h-5" />          /* 20px */

/* 大图标 - 装饰性 */
<Store className="w-6 h-6" />          /* 24px */
```

### 图标颜色

```tsx
/* 白色图标 - 深色背景 */
<Store className="w-6 h-6 text-white" />

/* 橙色图标 - 交互元素 */
<Download className="w-4 h-4 text-orange-600" />

/* 灰色图标 - 占位状态 */
<ImageIcon className="w-8 h-8 text-gray-400" />
```

### 图标背景圆角容器

```tsx
/* 小圆角图标容器 */
<div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center">
  <Store className="w-5 h-5 text-white" />
</div>

/* 大圆角图标容器 */
<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
  <Store className="w-6 h-6 text-white" />
</div>
```

---

## 🎨 特殊效果

### 1. 毛玻璃效果 (Backdrop Blur)

```tsx
/* 导航栏毛玻璃 */
<header className="bg-white/80 backdrop-blur-md">
  {/* 内容 */}
</header>

/* 说明:
   bg-white/80 - 80% 透明度的白色背景
   backdrop-blur-md - 中等程度的背景模糊
*/
```

### 2. 渐变文字

```tsx
/* 标题渐变文字 */
<h1 className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
  美团外卖店铺图片监控
</h1>

/* 原理:
   1. 设置渐变背景
   2. bg-clip-text 将背景裁剪到文字形状
   3. text-transparent 使文字透明,显示背景
*/
```

### 3. 半透明背景

```tsx
/* 50% 透明度的渐变背景 */
<div className="bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
  {/* 内容 */}
</div>

/* 30% 透明度的悬停背景 */
<div className="hover:bg-orange-100/30">
  {/* 内容 */}
</div>
```

### 4. 边框样式

```tsx
/* 细边框 */
<div className="border border-orange-100">

/* 粗边框 */
<div className="border-2 border-orange-200">

/* 无边框 */
<div className="border-0">
```

---

## 📋 组件代码示例

### 完整卡片示例

```tsx
<Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center mr-2">
        <Store className="w-5 h-5 text-white" />
      </div>
      店铺信息
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
    <div className="flex items-start">
      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">店铺名称:</span>
      <span className="flex-1 font-semibold">美味餐厅</span>
    </div>
    <div className="flex items-start">
      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">店铺ID:</span>
      <span className="flex-1 font-mono text-sm">123456789</span>
    </div>
    <div className="flex items-start">
      <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">更新时间:</span>
      <span className="flex-1 text-sm">2024-01-01 12:00:00</span>
    </div>
  </CardContent>
</Card>
```

### 图片预览卡片示例

```tsx
<Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md">
  <CardHeader>
    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center mr-2">
        <ImageIcon className="w-5 h-5 text-white" />
      </div>
      店铺图片预览
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* 店铺头像 */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">店铺头像</span>
        <Button
          size="sm"
          variant="ghost"
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg h-7"
        >
          <Download className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="h-56 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-2 border-orange-100 dark:border-slate-800">
        <img
          src="https://example.com/image.jpg"
          alt="店铺头像"
          className="w-full h-full object-contain p-2"
        />
      </div>
    </div>
  </CardContent>
</Card>
```

### 控制面板示例

```tsx
<Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-lg">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">控制面板</CardTitle>
    <CardDescription className="text-gray-600 dark:text-gray-400">
      监控文件: latest_poi_food.json
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        size="lg"
        variant="default"
        className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
      >
        <Play className="w-4 h-4 mr-2" />
        开始监控
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto rounded-xl border-2 border-orange-300 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-950 transition-all font-semibold"
      >
        <Download className="w-4 h-4 mr-2" />
        批量下载图片
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🔧 Tailwind 配置文件

### `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 45 100% 97%;
    --foreground: 30 20% 20%;
    --card: 0 0% 100%;
    --card-foreground: 30 20% 20%;
    --popover: 0 0% 100%;
    --popover-foreground: 30 20% 20%;
    --primary: 38 100% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 45 100% 94%;
    --secondary-foreground: 30 20% 20%;
    --muted: 45 50% 90%;
    --muted-foreground: 30 10% 45%;
    --accent: 38 100% 60%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 45 30% 85%;
    --input: 45 30% 85%;
    --ring: 38 100% 50%;
    --radius: 1rem;
  }

  .dark {
    --background: 30 15% 8%;
    --foreground: 45 100% 95%;
    --card: 30 20% 12%;
    --card-foreground: 45 100% 95%;
    --popover: 30 20% 12%;
    --popover-foreground: 45 100% 95%;
    --primary: 38 100% 55%;
    --primary-foreground: 30 15% 8%;
    --secondary: 30 25% 18%;
    --secondary-foreground: 45 100% 95%;
    --muted: 30 20% 20%;
    --muted-foreground: 45 50% 65%;
    --accent: 38 100% 60%;
    --accent-foreground: 30 15% 8%;
    --destructive: 0 62.8% 50%;
    --destructive-foreground: 210 40% 98%;
    --border: 30 25% 22%;
    --input: 30 25% 22%;
    --ring: 38 100% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
}
```

---

## 📦 shadcn/ui 组件配置

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

---

## ✅ 设计检查清单

在实现新页面或组件时,请确保:

### 颜色
- [ ] 使用橙黄渐变主题色
- [ ] 正确使用浅色/暗色模式
- [ ] 文字颜色对比度足够(WCAG AA 标准)
- [ ] 语义化颜色使用正确(成功/错误/警告/信息)

### 间距
- [ ] 使用统一的间距系统(4px 倍数)
- [ ] 卡片内边距使用 p-4 或 p-6
- [ ] 组件间距使用 space-y-4 或 space-y-6
- [ ] 网格间距使用 gap-6

### 圆角
- [ ] 卡片使用 rounded-2xl (16px)
- [ ] 按钮使用 rounded-xl (12px)
- [ ] 图标容器使用 rounded-xl
- [ ] 徽章使用 rounded-full

### 阴影
- [ ] 卡片默认使用 shadow-md
- [ ] 悬停时增强为 shadow-lg
- [ ] 添加 transition-shadow 过渡

### 字体
- [ ] 标题使用 font-bold
- [ ] 强调文字使用 font-semibold
- [ ] 普通文字使用 font-normal
- [ ] 代码文字使用 font-mono

### 响应式
- [ ] 使用 container mx-auto 容器
- [ ] 双栏布局使用 lg:grid-cols-2
- [ ] 按钮使用 w-full sm:w-auto
- [ ] 移动端优先设计

### 动画
- [ ] 添加 transition 类
- [ ] 悬停效果自然流畅
- [ ] 避免过度动画

### 图标
- [ ] 使用 Lucide React 图标
- [ ] 图标尺寸合适(w-4 h-4 或 w-5 h-5)
- [ ] 图标颜色与文字协调

---

## 🎯 快速复现步骤

### 1. 安装依赖

```bash
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install -D tailwindcss-animate
```

### 2. 配置 Tailwind

复制上述 `tailwind.config.ts` 和 `app/globals.css` 内容。

### 3. 安装 shadcn/ui 组件

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

### 4. 创建工具函数

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5. 使用组件

参考本文档的组件代码示例,直接复制使用。

---

## 📚 相关资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 组件库](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Next.js 文档](https://nextjs.org/docs)

---

## 📝 版本记录

**v1.0.0** - 2024-01-01
- 初始版本
- 橙黄渐变主题
- 完整的设计系统规范

---

<div align="center">

**使用本文档可以完整复现项目的 UI 设计风格**

Made with ❤️ for Design System

</div>

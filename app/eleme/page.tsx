'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Play, Square, Image as ImageIcon, Store, Download, Upload, Trash2, Home as HomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductImage {
  id: string
  name: string
  imageUrl: string
  timestamp: number
}

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export default function ElemePage() {
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)
  const [lastModified, setLastModified] = useState<number>(0)
  const logContainerRef = useRef<HTMLDivElement>(null)
  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null)
  const lastModifiedRef = useRef<number>(0)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    setLogs(prev => [...prev, { timestamp, message, type }])
  }

  const scrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (logs.length > 0) {
      scrollToBottom()
    }
  }, [logs])

  // 将 imageHash 转换为完整的图片 URL
  const imageHashToUrl = (imageHash: string): string => {
    if (!imageHash || imageHash.length < 6) return ''

    // 饿了么图片 URL 格式: https://cube.elemecdn.com/{1个字符}/{2个字符}/{文件名}.{扩展名}
    // imageHash 格式: b6d6e76768e7621a6e4b9c09befea61bjpg (前3个字符是目录信息)
    // 例如: b6d6e76768e7621a6e4b9c09befea61bjpg
    //   -> dir1: b (第1个字符)
    //   -> dir2: 6d (第2-3个字符)
    //   -> filename: 6e76768e7621a6e4b9c09befea61bjpg (从第4个字符开始)
    //   -> 最终URL: https://cube.elemecdn.com/b/6d/6e76768e7621a6e4b9c09befea61bjpg.jpg

    const dir1 = imageHash.charAt(0)           // 第1个字符
    const dir2 = imageHash.substring(1, 3)     // 第2-3个字符
    const filename = imageHash.substring(3)    // 从第4个字符开始

    // 从文件名中检测格式关键词来确定扩展名
    let extension = 'jpg' // 默认扩展名 (注意是jpg不是jpeg)
    if (filename.toLowerCase().includes('png')) {
      extension = 'png'
    } else if (filename.toLowerCase().includes('gif')) {
      extension = 'gif'
    } else if (filename.toLowerCase().includes('webp')) {
      extension = 'webp'
    }
    // jpg和jpeg都统一为jpg

    return `https://cube.elemecdn.com/${dir1}/${dir2}/${filename}.${extension}`
  }

  // 解析饿了么商品数据
  const processElemeProductData = (data: any) => {
    try {
      addLog('开始处理饿了么商品数据...', 'info')

      // 饿了么的商品数据在 menu.itemGroups[].items[] 中
      const menu = data.data?.resultMap?.menu
      if (!menu || !menu.itemGroups) {
        addLog('未找到商品数据结构', 'warning')
        return
      }

      let newProductCount = 0
      let totalProducts = 0

      // 遍历所有商品分组
      for (const itemGroup of menu.itemGroups) {
        if (!itemGroup.items || itemGroup.items.length === 0) continue

        for (const item of itemGroup.items) {
          // 跳过非商品项 (itemType = -1 表示分类标题等)
          if (item.itemType === -1 || !item.name || !item.imageHash) continue

          const productName = item.name
          const productId = item.itemId || item.tbItemId || Date.now().toString()
          const imageHash = item.imageHash

          // 将 imageHash 转换为完整 URL
          const imageUrl = imageHashToUrl(imageHash)

          if (imageUrl) {
            totalProducts++

            // 检查是否已存在 (根据商品名称去重)
            const existingIndex = productImages.findIndex(p => p.name === productName)

            if (existingIndex === -1) {
              // 新商品图片 (使用名称+时间戳确保唯一ID)
              const uniqueId = `${productId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              const newProduct: ProductImage = {
                id: uniqueId,
                name: productName,
                imageUrl: imageUrl,
                timestamp: Date.now()
              }

              setProductImages(prev => [...prev, newProduct])
              newProductCount++
              addLog(`📦 新商品: ${productName}`, 'success')

              // 调试日志: 输出前3个商品的URL到控制台
              if (newProductCount <= 3) {
                console.log(`[DEBUG] 商品: ${productName}`)
                console.log(`[DEBUG] imageHash: ${imageHash}`)
                console.log(`[DEBUG] 生成URL: ${imageUrl}`)
              }
            }
          }
        }
      }

      addLog(`🔍 扫描了 ${totalProducts} 个商品`, 'info')
      if (newProductCount > 0) {
        addLog(`✅ 本次新增 ${newProductCount} 个商品图片`, 'success')
        addLog(`📊 当前共有 ${productImages.length + newProductCount} 个商品图片`, 'info')
      } else {
        addLog('未发现新商品图片', 'info')
      }

    } catch (error: any) {
      addLog(`处理商品数据失败: ${error.message}`, 'error')
      console.error('商品数据处理错误:', error)
    }
  }

  // 选择要监控的文件
  const selectFileToMonitor = async () => {
    try {
      if (!('showOpenFilePicker' in window)) {
        addLog('您的浏览器不支持文件系统访问API', 'error')
        addLog('请使用 Chrome、Edge 或其他基于 Chromium 的浏览器', 'warning')
        return
      }

      addLog('📂 请在弹出的对话框中导航到 D:\\ailun 文件夹', 'info')
      addLog('📄 然后选择 xiaochengxueleme.txt 文件', 'info')

      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'JSON 文件 (*.txt, *.json)',
            accept: { 'application/json': ['.json', '.txt'] },
          },
        ],
        startIn: 'desktop',
      })

      setFileHandle(handle)
      fileHandleRef.current = handle
      addLog(`✅ 已选择文件: ${handle.name}`, 'success')
      addLog('📌 提示: 浏览器会记住此位置,下次打开会更快', 'info')

      // 读取一次文件内容
      const file = await handle.getFile()
      const initialModified = file.lastModified
      setLastModified(initialModified)
      lastModifiedRef.current = initialModified

      const content = await file.text()
      const data = JSON.parse(content)
      processElemeProductData(data)

      // 自动开始监控
      addLog('🚀 自动开始监控文件变化...', 'success')
      setIsMonitoring(true)

      const interval = setInterval(() => {
        checkFileUpdate()
      }, 2000)
      monitorIntervalRef.current = interval

    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog('❌ 已取消文件选择', 'warning')
      } else {
        addLog(`❌ 选择文件失败: ${error.message}`, 'error')
      }
    }
  }

  // 检查文件是否更新
  const checkFileUpdate = async () => {
    const handle = fileHandleRef.current
    const lastMod = lastModifiedRef.current

    if (!handle) return

    try {
      const file = await handle.getFile()
      const currentModified = file.lastModified

      if (currentModified > lastMod) {
        addLog('🔄 检测到文件更新!', 'success')
        addLog(`文件修改时间: ${new Date(currentModified).toLocaleString('zh-CN')}`, 'info')

        setLastModified(currentModified)
        lastModifiedRef.current = currentModified

        const content = await file.text()
        const data = JSON.parse(content)
        processElemeProductData(data)
      }
    } catch (error: any) {
      addLog(`读取文件失败: ${error.message}`, 'error')
      stopMonitoring()
    }
  }

  // 停止监控
  const stopMonitoring = () => {
    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current)
      monitorIntervalRef.current = null
    }
    setIsMonitoring(false)
    addLog('已停止监控', 'warning')
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current)
      }
    }
  }, [])

  // 清空商品数据
  const clearProductData = () => {
    if (confirm('确定要清空所有商品图片吗?')) {
      setProductImages([])
      addLog('商品数据已清空', 'warning')
    }
  }

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400'
      case 'error': return 'text-red-600 dark:text-red-400'
      case 'warning': return 'text-yellow-700 dark:text-yellow-400'
      default: return 'text-gray-700 dark:text-gray-300'
    }
  }

  // 通过 canvas 获取图片 Blob (绕过 CORS)
  const fetchImageAsBlob = async (url: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('无法创建 canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('无法转换为 Blob'))
              }
            },
            'image/jpeg',
            0.95
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }

      img.src = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`
    })
  }

  // 下载图片到指定文件夹
  const downloadImageToFolder = async (url: string, filename: string, dirHandle: any): Promise<boolean> => {
    try {
      addLog(`下载中: ${filename}`, 'info')

      const blob = await fetchImageAsBlob(url)

      const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
      const writable = await fileHandle.createWritable()

      await writable.write(blob)
      await writable.close()

      addLog(`✅ 已保存: ${filename}`, 'success')
      return true
    } catch (error: any) {
      addLog(`❌ 下载失败: ${filename} - ${error.message}`, 'error')
      return false
    }
  }

  // 批量下载所有图片
  const downloadAllImages = async () => {
    if (productImages.length === 0) {
      addLog('没有可下载的图片', 'warning')
      return
    }

    try {
      if (!('showDirectoryPicker' in window)) {
        addLog('您的浏览器不支持文件夹选择功能', 'error')
        addLog('请使用 Chrome 86+ 或 Edge 86+ 浏览器', 'warning')
        return
      }

      addLog('📁 请选择图片保存的文件夹...', 'info')

      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'downloads',
      })

      addLog(`✅ 已选择文件夹: ${dirHandle.name}`, 'success')
      addLog('开始批量下载图片...', 'info')

      let downloadCount = 0

      // 根据商品名称去重
      const uniqueProducts = Array.from(
        productImages.reduce((map, product) => {
          const existing = map.get(product.name)
          if (!existing || product.timestamp > existing.timestamp) {
            map.set(product.name, product)
          }
          return map
        }, new Map<string, ProductImage>()).values()
      )

      for (const product of uniqueProducts) {
        const safeName = product.name.replace(/[<>:"/\\|?*]/g, '_')
        const filename = `${safeName}.jpg`
        const success = await downloadImageToFolder(product.imageUrl, filename, dirHandle)
        if (success) downloadCount++
      }

      addLog(`✅ 批量下载完成! 共保存 ${downloadCount} 张图片到文件夹: ${dirHandle.name}`, 'success')
    } catch (error: any) {
      if (error.name === 'AbortError') {
        addLog('❌ 已取消文件夹选择', 'warning')
      } else {
        addLog(`❌ 批量下载失败: ${error.message}`, 'error')
      }
    }
  }

  // 单个图片下载
  const downloadImage = async (url: string, filename: string) => {
    try {
      addLog(`开始下载: ${filename}`, 'info')

      const blob = await fetchImageAsBlob(url)
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)
      addLog(`下载成功: ${filename}`, 'success')
    } catch (error: any) {
      addLog(`下载失败: ${filename} - ${error.message}`, 'error')
    }
  }

  // 根据商品名称去重
  const uniqueProducts = Array.from(
    productImages.reduce((map, product) => {
      const existing = map.get(product.name)
      if (!existing || product.timestamp > existing.timestamp) {
        map.set(product.name, product)
      }
      return map
    }, new Map<string, ProductImage>()).values()
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-blue-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                饿了么店铺图片提取系统
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                variant={isMonitoring ? "default" : "secondary"}
                className="px-4 py-1.5 rounded-full text-sm font-medium"
              >
                {isMonitoring ? '🟢 监控中' : '⭕ 未监控'}
              </Badge>
              <Link href="/">
                <Button variant="outline" className="rounded-xl">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  返回主页
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Control Panel */}
        <Card className="mb-6 bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">控制面板</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              选择饿了么商品文件,系统将自动检测文件变化并提取商品图片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* 路径提示 */}
              {!fileHandle && (
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950 border-l-4 border-cyan-500 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-cyan-800 dark:text-cyan-200 mb-1">
                        快速选择提示
                      </p>
                      <p className="text-cyan-700 dark:text-cyan-300">
                        点击"选择监控文件"后,在弹出的对话框中:
                      </p>
                      <ol className="mt-2 space-y-1 text-cyan-700 dark:text-cyan-300 list-decimal list-inside">
                        <li>在地址栏输入: <code className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900 rounded font-mono text-xs">D:\ailun</code></li>
                        <li>按 Enter 键快速跳转到该文件夹</li>
                        <li>选择 <code className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900 rounded font-mono text-xs">xiaochengxueleme.txt</code> 文件</li>
                        <li>浏览器会记住此位置,下次更快!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* 商品信息监控 */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-blue-200 dark:border-slate-600">
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">🛒 饿了么商品信息</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {!isMonitoring ? (
                      <Button
                        onClick={selectFileToMonitor}
                        size="lg"
                        variant="default"
                        className="rounded-xl shadow-md hover:shadow-lg transition-all font-semibold bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {fileHandle ? '重新选择文件' : '选择监控文件'}
                      </Button>
                    ) : (
                      <Button
                        onClick={stopMonitoring}
                        size="lg"
                        variant="destructive"
                        className="rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        停止监控
                      </Button>
                    )}
                    {fileHandle && (
                      <div className="flex items-center px-3 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">当前文件:</span>
                        <span className="ml-2 text-blue-600 dark:text-blue-400">{fileHandle.name}</span>
                      </div>
                    )}
                  </div>

                  {fileHandle && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={downloadAllImages}
                        size="lg"
                        variant="outline"
                        className="rounded-xl border-2 border-blue-300 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-950 transition-all font-semibold"
                        disabled={productImages.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        批量下载全部
                      </Button>
                      <Button
                        onClick={clearProductData}
                        size="lg"
                        variant="outline"
                        className="rounded-xl border-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900 transition-all font-semibold"
                        disabled={productImages.length === 0}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空数据
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* 商品统计信息 */}
              {productImages.length > 0 && (
                <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-cyan-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">📊 当前商品总数:</span>
                      <Badge variant="outline" className="text-lg px-3 py-1 bg-white dark:bg-slate-900">
                        {uniqueProducts.length} 个 (已去重)
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 运行日志 - 全宽显示 */}
        <Card className="mb-6 bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">📋 运行日志</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              实时显示系统运行状态和操作记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={logContainerRef}
              className="h-[400px] overflow-y-auto bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-4 font-mono text-sm border border-blue-100 dark:border-slate-800"
            >
              {logs.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  暂无日志记录
                </div>
              )}
              {logs.map((log, index) => (
                <div key={index} className={`${getLogColor(log.type)} mb-1 hover:bg-blue-100/30 dark:hover:bg-slate-800/30 px-2 py-0.5 rounded transition-colors`}>
                  <span className="text-gray-600 dark:text-gray-400">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 商品图片展示区域 - 全宽底部 */}
        {productImages.length > 0 && (
          <Card className="mt-6 bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-800 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mr-2">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  商品图片 ({uniqueProducts.length})
                </CardTitle>
                <Button
                  onClick={downloadAllImages}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  批量下载所有图片
                </Button>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                商品图片会随着文件更新不断累积,已自动根据商品名称去重
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                {uniqueProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-slate-950 dark:to-slate-900 rounded-md flex items-center justify-center overflow-hidden border border-blue-100 dark:border-slate-800">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-1 px-0.5">
                      <p className="text-[10px] text-gray-700 dark:text-gray-300 font-medium truncate" title={product.name}>
                        {product.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const safeName = product.name.replace(/[<>:"/\\|?*]/g, '_')
                        downloadImage(product.imageUrl, `${safeName}.jpg`)
                      }}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-blue-600 hover:text-blue-700 hover:bg-white dark:text-blue-400 dark:hover:bg-slate-800 rounded-md h-6 w-6 p-0"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>饿了么店铺图片提取系统 v1.0</p>
        <p className="mt-2">🤖 Generated with Claude Code</p>
      </footer>
    </div>
  )
}

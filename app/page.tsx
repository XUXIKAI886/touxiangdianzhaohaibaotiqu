'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, Image as ImageIcon, Store, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StoreInfo {
  name: string
  id: string
  avatarUrl?: string
  headerUrl?: string
  posterUrls?: string[]
  updateTime: string
}

interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

export default function Home() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const [headerLoaded, setHeaderLoaded] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    setLogs(prev => [...prev, { timestamp, message, type }])
  }

  const scrollToBottom = () => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const toggleMonitoring = () => {
    if (!isMonitoring) {
      startMonitoring()
    } else {
      stopMonitoring()
    }
  }

  const startMonitoring = () => {
    setIsMonitoring(true)
    addLog('开始监控文件变化...', 'info')

    // 开始轮询检查文件更新
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/check-update')
        const data = await response.json()

        if (data.updated) {
          addLog('检测到文件更新,开始处理...', 'info')
          await processStore()
        }
      } catch (error) {
        addLog(`监控异常: ${error}`, 'error')
      }
    }, 2000)

    // 保存interval ID用于停止
    ;(window as any).monitorInterval = interval
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    addLog('监控已停止', 'warning')

    if ((window as any).monitorInterval) {
      clearInterval((window as any).monitorInterval)
    }
  }

  const processStore = async () => {
    try {
      // 清空旧图片
      setAvatarLoaded(false)
      setHeaderLoaded(false)
      setPosterLoaded(false)
      addLog('清空旧图片预览', 'info')

      const response = await fetch('/api/extract-images')
      const data = await response.json()

      if (data.success) {
        setStoreInfo({
          name: data.storeName,
          id: data.storeId,
          avatarUrl: data.avatarUrl,
          headerUrl: data.headerUrl,
          posterUrls: data.posterUrls,
          updateTime: new Date().toLocaleString('zh-CN')
        })

        addLog(`店铺: ${data.storeName}`, 'success')
        addLog(`ID: ${data.storeId}`, 'info')

        if (data.avatarUrl) {
          addLog('下载头像...', 'info')
          setAvatarLoaded(true)
        }

        if (data.headerUrl) {
          addLog('下载店招...', 'info')
          setHeaderLoaded(true)
        }

        if (data.posterUrls && data.posterUrls.length > 0) {
          addLog(`下载 ${data.posterUrls.length} 张海报...`, 'info')
          setPosterLoaded(true)
        } else {
          addLog('该店铺暂无活动海报', 'warning')
        }

        addLog('所有图片处理完毕', 'success')
      } else {
        addLog(`处理失败: ${data.error}`, 'error')
      }
    } catch (error) {
      addLog(`处理失败: ${error}`, 'error')
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

  const downloadImage = async (url: string, filename: string) => {
    try {
      addLog(`开始下载: ${filename}`, 'info')
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)
      addLog(`下载成功: ${filename}`, 'success')
    } catch (error) {
      addLog(`下载失败: ${filename}`, 'error')
    }
  }

  const downloadAllImages = async () => {
    if (!storeInfo) {
      addLog('没有可下载的图片', 'warning')
      return
    }

    addLog('开始批量下载图片...', 'info')
    const storeName = storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')

    if (storeInfo.avatarUrl) {
      await downloadImage(storeInfo.avatarUrl, `${storeName}_头像.jpg`)
    }

    if (storeInfo.headerUrl) {
      await downloadImage(storeInfo.headerUrl, `${storeName}_店招.jpg`)
    }

    if (storeInfo.posterUrls) {
      for (let i = 0; i < storeInfo.posterUrls.length; i++) {
        await downloadImage(storeInfo.posterUrls[i], `${storeName}_海报${i + 1}.jpg`)
      }
    }

    addLog('批量下载完成!', 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-orange-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                美团外卖店铺图片监控
              </h1>
            </div>
            <Badge variant={isMonitoring ? "default" : "secondary"} className="px-4 py-1.5 rounded-full text-sm font-medium">
              {isMonitoring ? '🟢 运行中' : '⚪ 未启动'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Control Panel */}
        <Card className="mb-6 bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">控制面板</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              监控文件: latest_poi_food.json
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={toggleMonitoring}
                size="lg"
                variant={isMonitoring ? "destructive" : "default"}
                className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
              >
                {isMonitoring ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    停止监控
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始监控
                  </>
                )}
              </Button>
              <Button
                onClick={downloadAllImages}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-2 border-orange-300 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-950 transition-all font-semibold"
                disabled={!storeInfo || (!avatarLoaded && !headerLoaded && !posterLoaded)}
              >
                <Download className="w-4 h-4 mr-2" />
                批量下载图片
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Store Info */}
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
                  <span className="flex-1 font-semibold">{storeInfo?.name || '等待数据...'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">店铺ID:</span>
                  <span className="flex-1 font-mono text-sm">{storeInfo?.id || '-'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">更新时间:</span>
                  <span className="flex-1 text-sm">{storeInfo?.updateTime || '-'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Logs */}
            <Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">📋 运行日志</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] overflow-y-auto bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-4 font-mono text-sm border border-orange-100 dark:border-slate-800">
                  {logs.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      暂无日志记录
                    </div>
                  )}
                  {logs.map((log, index) => (
                    <div key={index} className={`${getLogColor(log.type)} mb-1 hover:bg-orange-100/30 dark:hover:bg-slate-800/30 px-2 py-0.5 rounded transition-colors`}>
                      <span className="text-gray-600 dark:text-gray-400">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            {/* Images Grid */}
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
                {/* Avatar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">店铺头像</span>
                    {avatarLoaded && storeInfo?.avatarUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(storeInfo.avatarUrl!, `${storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')}_头像.jpg`)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg h-7"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="h-56 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-2 border-orange-100 dark:border-slate-800">
                    {avatarLoaded && storeInfo?.avatarUrl ? (
                      <img
                        src={storeInfo.avatarUrl}
                        alt="店铺头像"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 text-sm">暂无图片</span>
                    )}
                  </div>
                </div>

                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">店铺店招</span>
                    {headerLoaded && storeInfo?.headerUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(storeInfo.headerUrl!, `${storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')}_店招.jpg`)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg h-7"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="h-52 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-2 border-orange-100 dark:border-slate-800">
                    {headerLoaded && storeInfo?.headerUrl ? (
                      <img
                        src={storeInfo.headerUrl}
                        alt="店铺店招"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 text-sm">暂无图片</span>
                    )}
                  </div>
                </div>

                {/* Poster */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">店铺海报</span>
                      {posterLoaded && storeInfo?.posterUrls && storeInfo.posterUrls.length > 1 && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded-full">
                          {storeInfo.posterUrls.length}张
                        </span>
                      )}
                    </div>
                    {posterLoaded && storeInfo?.posterUrls && storeInfo.posterUrls.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(storeInfo.posterUrls![0], `${storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')}_海报1.jpg`)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950 rounded-lg h-7"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="h-64 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-2 border-orange-100 dark:border-slate-800">
                    {posterLoaded && storeInfo?.posterUrls && storeInfo.posterUrls.length > 0 ? (
                      <img
                        src={storeInfo.posterUrls[0]}
                        alt="店铺海报"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 text-sm">暂无图片</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

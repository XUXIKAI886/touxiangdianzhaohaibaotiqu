'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, Image as ImageIcon, Store, Download, Upload, Trash2 } from 'lucide-react'
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

// 本地存储管理
const STORAGE_KEY = 'meituan_store_data'
const HISTORY_KEY = 'meituan_store_history'

export default function Home() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const [headerLoaded, setHeaderLoaded] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [storeHistory, setStoreHistory] = useState<StoreInfo[]>([])
  const logEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 从本地存储加载数据
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    const savedHistory = localStorage.getItem(HISTORY_KEY)

    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setStoreInfo(data)
        setAvatarLoaded(!!data.avatarUrl)
        setHeaderLoaded(!!data.headerUrl)
        setPosterLoaded(!!data.posterUrls && data.posterUrls.length > 0)
        addLog('已从本地存储加载数据', 'success')
      } catch (error) {
        addLog('加载本地数据失败', 'error')
      }
    }

    if (savedHistory) {
      try {
        setStoreHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('加载历史记录失败', error)
      }
    }
  }, [])

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

  // 移除美团图片URL的尺寸参数,获取原图
  const removeSizeParams = (url: string): string => {
    if (!url) return url
    return url.replace(/@\d+w_\d+h_\d+e_\d+c/g, '')
  }

  // 处理JSON文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    addLog(`正在读取文件: ${file.name}`, 'info')

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        processJsonData(data)
      } catch (error) {
        addLog(`文件解析失败: ${error}`, 'error')
      }
    }
    reader.onerror = () => {
      addLog('文件读取失败', 'error')
    }
    reader.readAsText(file)
  }

  // 解析JSON数据
  const processJsonData = (data: any) => {
    try {
      // 清空旧图片
      setAvatarLoaded(false)
      setHeaderLoaded(false)
      setPosterLoaded(false)
      addLog('开始处理店铺数据...', 'info')

      // 提取店铺信息 (兼容两种JSON格式)
      let poiInfo = data.data?.poi_info || {}
      const poiBaseInfo = data.data?.poi_base_info || {}

      // 优先使用poi_info,如果为空则使用poi_base_info
      if (!poiInfo || Object.keys(poiInfo).length === 0) {
        poiInfo = poiBaseInfo
      }

      const operationList = data.data?.container_operation_source?.operation_source_list || []

      const storeName = poiInfo.name || '未知店铺'
      const storeId = poiInfo.poi_id_str || 'unknown'

      // 提取头像URL
      const avatarUrl = removeSizeParams(poiInfo.pic_url || '')

      // 提取店招图片 (从content_area_info中查找)
      let headerUrl = poiInfo.head_pic_url || ''
      if (!headerUrl) {
        const contentList = data.data?.content_area_info?.content_list || []
        for (const content of contentList) {
          if (content.content_type === 6 && content.content_title === '图片') {
            const dataList = content.content_data_list || []
            if (dataList.length > 0) {
              try {
                const picData = JSON.parse(dataList[0])
                headerUrl = picData.pic_url || ''
              } catch {
                // Ignore parse errors
              }
            }
            break
          }
        }
      }
      headerUrl = removeSizeParams(headerUrl)

      // 提取海报 (跳过粉丝群海报)
      const posterUrls: string[] = []
      for (const item of operationList) {
        const picUrl = item.pic_url || ''
        if (picUrl && !picUrl.includes('fans_group_poster')) {
          posterUrls.push(picUrl.split('?')[0])
        }
      }

      const newStoreInfo: StoreInfo = {
        name: storeName,
        id: storeId,
        avatarUrl: avatarUrl || undefined,
        headerUrl: headerUrl || undefined,
        posterUrls: posterUrls.length > 0 ? posterUrls : undefined,
        updateTime: new Date().toLocaleString('zh-CN')
      }

      // 保存到本地存储
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStoreInfo))

      // 保存到历史记录
      const newHistory = [newStoreInfo, ...storeHistory.filter(item => item.id !== storeId)].slice(0, 10)
      setStoreHistory(newHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))

      setStoreInfo(newStoreInfo)

      addLog(`店铺: ${storeName}`, 'success')
      addLog(`ID: ${storeId}`, 'info')

      if (avatarUrl) {
        addLog('提取到店铺头像', 'info')
        setAvatarLoaded(true)
      }

      if (headerUrl) {
        addLog('提取到店铺店招', 'info')
        setHeaderLoaded(true)
      }

      if (posterUrls.length > 0) {
        addLog(`提取到 ${posterUrls.length} 张海报`, 'info')
        setPosterLoaded(true)
      } else {
        addLog('该店铺暂无活动海报', 'warning')
      }

      addLog('数据处理完成!', 'success')
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

  const clearData = () => {
    if (confirm('确定要清空当前数据吗?')) {
      localStorage.removeItem(STORAGE_KEY)
      setStoreInfo(null)
      setAvatarLoaded(false)
      setHeaderLoaded(false)
      setPosterLoaded(false)
      addLog('数据已清空', 'warning')
    }
  }

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗?')) {
      localStorage.removeItem(HISTORY_KEY)
      setStoreHistory([])
      addLog('历史记录已清空', 'warning')
    }
  }

  const loadHistoryItem = (item: StoreInfo) => {
    setStoreInfo(item)
    setAvatarLoaded(!!item.avatarUrl)
    setHeaderLoaded(!!item.headerUrl)
    setPosterLoaded(!!item.posterUrls && item.posterUrls.length > 0)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item))
    addLog(`已加载历史记录: ${item.name}`, 'success')
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
                美团外卖店铺图片提取系统
              </h1>
            </div>
            <Badge variant="default" className="px-4 py-1.5 rounded-full text-sm font-medium">
              💾 本地存储版
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
              上传 Fiddler 抓取的 JSON 文件,提取店铺图片数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                variant="default"
                className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
              >
                <Upload className="w-4 h-4 mr-2" />
                上传 JSON 文件
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
              <Button
                onClick={clearData}
                size="lg"
                variant="destructive"
                className="w-full sm:w-auto rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                disabled={!storeInfo}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空数据
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
                  <span className="flex-1 font-semibold">{storeInfo?.name || '等待上传数据...'}</span>
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

            {/* History */}
            {storeHistory.length > 0 && (
              <Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">📚 历史记录</CardTitle>
                    <Button
                      onClick={clearHistory}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {storeHistory.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => loadHistoryItem(item)}
                        className="p-3 bg-orange-50/50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="font-semibold text-sm text-gray-800 dark:text-white">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ID: {item.id} • {item.updateTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Logs */}
            <Card className="bg-white dark:bg-slate-900 border-orange-200 dark:border-slate-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">📋 运行日志</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-y-auto bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-4 font-mono text-sm border border-orange-100 dark:border-slate-800">
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

                {/* 多张海报展示 */}
                {posterLoaded && storeInfo?.posterUrls && storeInfo.posterUrls.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {storeInfo.posterUrls.slice(1).map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="h-40 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-slate-950 dark:to-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-orange-100 dark:border-slate-800">
                          <img
                            src={url}
                            alt={`海报${index + 2}`}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadImage(url, `${storeInfo.name.replace(/[<>:"/\\|?*]/g, '_')}_海报${index + 2}.jpg`)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-orange-600 hover:text-orange-700 hover:bg-white dark:text-orange-400 dark:hover:bg-slate-800 rounded-lg h-6 w-6 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Store, ArrowRight, Image as ImageIcon, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [copied, setCopied] = useState(false)

  const fiddlerScript = `if(oSession.uriContains("https://wx.waimai.meituan.com/weapp/shop/v1/poi/productlist?ui")){
    oSession.utilDecodeResponse();
    oSession.SaveResponse("D:/ailun/xiaochengxumeituan.txt",true);
    oSession.SaveResponseBody("D:/ailun/xiaochengxumeituan.txt");
}
if(oSession.uriContains("https://wx.waimai.meituan.com/weapp/poi/food/render?ui")){
    oSession.utilDecodeResponse();
    oSession.SaveResponse("D:/ailun/xiaochengxumeituan01.txt",true);
    oSession.SaveResponseBody("D:/ailun/xiaochengxumeituan01.txt");
}
if(oSession.uriContains("https://waimai-guide.ele.me/h5/mtop.alsc.waimai.store.miniapp.store.detail.body.query.v2/1.0/2.0/")){
    oSession.utilDecodeResponse();
    oSession.SaveResponse("D:/ailun/xiaochengxueleme.txt",true);
    oSession.SaveResponseBody("D:/ailun/xiaochengxueleme.txt");
}
if(oSession.uriContains("https://wx.waimai.meituan.com/weapp/v1/poi/food")){
    oSession.utilDecodeResponse();
    oSession.SaveResponse("D:/ailun/sanjiantao.txt",true);
    oSession.SaveResponseBody("D:/ailun/sanjiantao.txt");
}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fiddlerScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-orange-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                外卖平台图片提取系统
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* 介绍文本 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              选择您要使用的平台
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              支持美团外卖和饿了么平台的店铺图片提取功能
            </p>
          </div>

          {/* 项目卡片网格 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 美团外卖卡片 */}
            <Link href="/meituan" className="group">
              <Card className="h-full bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Store className="w-9 h-9 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-orange-400 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    美团外卖
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                    提取美团外卖店铺的头像、店招、海报和商品图片
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持店铺基本信息图片提取
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持商品图片批量提取
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持双文件监控功能
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        自动去重同名商品
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all"
                  >
                    进入美团系统
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* 饿了么卡片 */}
            <Link href="/eleme" className="group">
              <Card className="h-full bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <Store className="w-9 h-9 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    饿了么
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                    提取饿了么店铺的头像、店招、海报和商品图片
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持店铺基本信息图片提取
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持商品图片批量提取
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        支持文件实时监控
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        自动批量下载功能
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all"
                  >
                    进入饿了么系统
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* 底部说明 */}
          <div className="mt-12 space-y-6">
            {/* 使用说明 */}
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-orange-200 dark:border-slate-700">
              <CardContent className="py-6">
                <div className="flex items-start justify-center space-x-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">使用说明</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• 支持本地文件实时监控,自动提取新增店铺和商品图片</li>
                      <li>• 所有数据存储在浏览器本地,保护您的隐私安全</li>
                      <li>• 支持批量下载图片到指定文件夹</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fiddler配置脚本 */}
            <Card className="bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <div className="text-2xl mr-2">⚙️</div>
                    Fiddler 配置脚本
                  </CardTitle>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        复制脚本
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                  将以下脚本添加到 Fiddler 的 CustomRules.js 文件中,用于自动保存抓包数据
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-950 dark:to-slate-900 rounded-xl p-4 overflow-x-auto border border-gray-200 dark:border-slate-700">
                    <code className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre">
{fiddlerScript}
                    </code>
                  </pre>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>提示:</strong> 脚本会自动保存到 D:/ailun/ 目录,请确保该目录已创建
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>外卖平台图片提取系统 v2.0 - 支持美团外卖与饿了么</p>
        <p className="mt-2">🤖 Generated with Claude Code</p>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ArrowLeft, Store, Construction, Home as HomeIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ElemePage() {
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
            <Link href="/">
              <Button variant="outline" className="rounded-xl">
                <HomeIcon className="w-4 h-4 mr-2" />
                返回主页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-800 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-3xl flex items-center justify-center">
                  <Construction className="w-14 h-14 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                功能开发中
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                饿了么店铺图片提取功能正在火热开发中,敬请期待!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 计划功能列表 */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">🎯</span>
                    计划支持的功能
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">店铺基本信息提取</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          提取饿了么店铺的头像、店招、海报等基本信息图片
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">商品图片批量提取</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          支持批量提取店铺商品主图,自动去重同名商品
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">文件实时监控</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          配合 Fiddler 抓包,实时监控本地 JSON 文件变化
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">批量下载功能</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          一键下载所有提取的图片到指定文件夹
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 开发进度 */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <span className="text-xl mr-2">📅</span>
                    开发进度
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">数据结构分析</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">待开始</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>

                {/* 行动按钮 */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-2 border-blue-300 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-950 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      返回首页
                    </Button>
                  </Link>
                  <Link href="/meituan" className="flex-1">
                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      使用美团系统
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提示卡片 */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 border-blue-200 dark:border-slate-700">
            <CardContent className="py-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">开发计划</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    饿了么系统的功能将参考美团系统的架构设计,提供相同的用户体验。
                    如果您需要立即使用类似功能,可以先使用美团外卖图片提取系统。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>饿了么店铺图片提取系统 - 开发中</p>
        <p className="mt-2">🤖 Generated with Claude Code</p>
      </footer>
    </div>
  )
}

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface PoiInfo {
  name?: string
  poi_id_str?: string
  pic_url?: string
  head_pic_url?: string
}

interface OperationItem {
  pic_url?: string
}

interface JsonData {
  data?: {
    poi_info?: PoiInfo
    poi_base_info?: PoiInfo
    container_operation_source?: {
      operation_source_list?: OperationItem[]
    }
    content_area_info?: {
      content_list?: Array<{
        content_type?: number
        content_title?: string
        content_data_list?: string[]
      }>
    }
  }
}

function removeSizeParams(url: string): string {
  if (!url) return url
  return url.replace(/@\d+w_\d+h_\d+e_\d+c/g, '')
}

export async function GET() {
  try {
    const jsonFilePath = path.join(process.cwd(), '..', 'latest_poi_food.json')

    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json({ success: false, error: 'JSON file not found' }, { status: 404 })
    }

    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8')
    const data: JsonData = JSON.parse(fileContent)

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

    return NextResponse.json({
      success: true,
      storeName,
      storeId,
      avatarUrl: avatarUrl || undefined,
      headerUrl: headerUrl || undefined,
      posterUrls: posterUrls.length > 0 ? posterUrls : undefined,
    })
  } catch (error) {
    console.error('Extract images error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

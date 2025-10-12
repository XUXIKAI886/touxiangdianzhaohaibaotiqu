import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 存储上次文件修改时间
let lastModifiedTime = 0

export async function GET() {
  try {
    const jsonFilePath = path.join(process.cwd(), '..', 'latest_poi_food.json')

    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json({ updated: false, error: 'File not found' })
    }

    const stats = fs.statSync(jsonFilePath)
    const currentModifiedTime = stats.mtimeMs

    const updated = currentModifiedTime > lastModifiedTime

    if (updated) {
      lastModifiedTime = currentModifiedTime
    }

    return NextResponse.json({ updated, lastModified: new Date(currentModifiedTime).toISOString() })
  } catch (error) {
    console.error('Check update error:', error)
    return NextResponse.json({ updated: false, error: String(error) }, { status: 500 })
  }
}

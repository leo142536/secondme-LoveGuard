import { NextResponse } from 'next/server'
import { callSecondMeAPI } from '@/lib/auth'

export async function GET() {
  try {
    const shades = await callSecondMeAPI('/api/user/shades')
    return NextResponse.json({ code: 0, data: shades })
  } catch (error) {
    return NextResponse.json(
      { code: 1, message: error instanceof Error ? error.message : '获取兴趣标签失败' },
      { status: 401 }
    )
  }
}

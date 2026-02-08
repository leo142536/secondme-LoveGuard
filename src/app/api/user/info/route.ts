import { NextResponse } from 'next/server'
import { callSecondMeAPI } from '@/lib/auth'

export async function GET() {
  try {
    const userInfo = await callSecondMeAPI('/api/user/info')
    return NextResponse.json({ code: 0, data: userInfo })
  } catch (error) {
    return NextResponse.json(
      { code: 1, message: error instanceof Error ? error.message : '获取用户信息失败' },
      { status: 401 }
    )
  }
}

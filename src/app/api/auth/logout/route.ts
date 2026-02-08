import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // 清除登录 cookie
  response.cookies.delete('user_id')

  return response
}

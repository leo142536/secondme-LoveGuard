import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ code: 1, message: '未登录' }, { status: 401 })
    }

    const { message, actionControl, advisorType } = await request.json()

    // 调用 SecondMe Act API
    const response = await fetch(
      `${process.env.SECONDME_API_BASE_URL}/api/act`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          action_control: actionControl,
          stream: true,
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { code: 1, message: 'Act API 调用失败' },
        { status: 500 }
      )
    }

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Act API 错误:', error)
    return NextResponse.json(
      { code: 1, message: '服务器错误' },
      { status: 500 }
    )
  }
}

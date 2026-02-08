import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response('未登录', { status: 401 })
    }

    const { message, sessionId } = await request.json()

    // 调用 SecondMe 聊天 API（流式）
    const response = await fetch(
      `${process.env.SECONDME_API_BASE_URL}/api/chat`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          stream: true,
        }),
      }
    )

    if (!response.ok) {
      return new Response('聊天请求失败', { status: 500 })
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
    console.error('聊天 API 错误:', error)
    return new Response('服务器错误', { status: 500 })
  }
}

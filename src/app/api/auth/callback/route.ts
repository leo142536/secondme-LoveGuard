import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect('/?error=no_code')
  }

  // 验证 state（宽松模式，适配 WebView）
  const savedState = request.cookies.get('oauth_state')?.value
  if (state !== savedState) {
    console.warn('OAuth state 验证失败，可能是跨 WebView 场景')
    // 继续处理，不阻止登录
  }

  try {
    // 用 code 换取 access token
    const tokenResponse = await fetch(process.env.SECONDME_TOKEN_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SECONDME_REDIRECT_URI!,
        client_id: process.env.SECONDME_CLIENT_ID!,
        client_secret: process.env.SECONDME_CLIENT_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect('/?error=token_exchange_failed')
    }

    const tokenData = await tokenResponse.json()

    // 获取用户信息
    const userInfoResponse = await fetch(
      `${process.env.SECONDME_API_BASE_URL}/api/user/info`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    )

    if (!userInfoResponse.ok) {
      return NextResponse.redirect('/?error=user_info_failed')
    }

    const userInfoResult = await userInfoResponse.json()

    // SecondMe API 统一响应格式
    if (userInfoResult.code !== 0) {
      return NextResponse.redirect('/?error=user_info_failed')
    }

    const userInfo = userInfoResult.data

    // 计算 token 过期时间
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

    // 保存或更新用户信息
    const user = await prisma.user.upsert({
      where: { secondmeUserId: userInfo.id },
      update: {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
      },
      create: {
        secondmeUserId: userInfo.id,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    })

    // 设置登录 cookie
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 天
    })

    // 清除 oauth_state cookie
    response.cookies.delete('oauth_state')

    return response
  } catch (error) {
    console.error('OAuth 回调处理失败:', error)
    return NextResponse.redirect('/?error=callback_failed')
  }
}


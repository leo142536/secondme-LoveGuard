import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.SECONDME_CLIENT_ID!
  const redirectUri = process.env.SECONDME_REDIRECT_URI!
  const oauthUrl = process.env.SECONDME_OAUTH_URL!

  // 生成 state 用于 CSRF 防护
  const state = Math.random().toString(36).substring(7)

  // 构建授权 URL
  const authUrl = new URL(`${oauthUrl}authorize`)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'user.info user.info.shades user.info.softmemory chat voice')
  authUrl.searchParams.set('state', state)

  // 将 state 存储到 cookie
  const response = NextResponse.redirect(authUrl.toString())
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 分钟
  })

  return response
}

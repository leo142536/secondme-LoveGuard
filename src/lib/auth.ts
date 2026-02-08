import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECONDME_API_BASE_URL = process.env.SECONDME_API_BASE_URL!
const SECONDME_TOKEN_ENDPOINT = process.env.SECONDME_TOKEN_ENDPOINT!

export interface SecondMeUser {
  id: string
  nickname: string
  avatar: string
  accessToken: string
  refreshToken: string
  tokenExpiresAt: Date
}

/**
 * 获取当前登录用户
 */
export async function getCurrentUser(): Promise<SecondMeUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return null
  }

  // 检查 token 是否过期
  if (new Date() >= user.tokenExpiresAt) {
    // 尝试刷新 token
    const refreshed = await refreshAccessToken(user.refreshToken)
    if (!refreshed) {
      return null
    }

    // 更新数据库
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        tokenExpiresAt: refreshed.expiresAt,
      },
    })

    return {
      id: updatedUser.id,
      nickname: updatedUser.nickname || '',
      avatar: updatedUser.avatar || '',
      accessToken: updatedUser.accessToken,
      refreshToken: updatedUser.refreshToken,
      tokenExpiresAt: updatedUser.tokenExpiresAt,
    }
  }

  return {
    id: user.id,
    nickname: user.nickname || '',
    avatar: user.avatar || '',
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    tokenExpiresAt: user.tokenExpiresAt,
  }
}

/**
 * 刷新 access token
 */
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(SECONDME_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SECONDME_CLIENT_ID!,
        client_secret: process.env.SECONDME_CLIENT_SECRET!,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    }
  } catch (error) {
    console.error('刷新 token 失败:', error)
    return null
  }
}

/**
 * 调用 SecondMe API
 */
export async function callSecondMeAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('未登录')
  }

  const response = await fetch(`${SECONDME_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API 调用失败: ${response.statusText}`)
  }

  const result = await response.json()

  // SecondMe API 统一响应格式
  if (result.code === 0) {
    return result.data
  } else {
    throw new Error(result.message || 'API 调用失败')
  }
}


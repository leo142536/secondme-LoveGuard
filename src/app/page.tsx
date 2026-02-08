'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserInfo {
  id: string
  nickname: string
  avatar: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查登录状态
    fetch('/api/user/info')
      .then(res => res.json())
      .then(data => {
        if (data.code === 0) {
          setUser(data.data)
        }
      })
      .catch(() => {
        // 未登录
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLogin = () => {
    window.location.href = '/api/auth/login'
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 顶部导航 */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-pink-600">💝 AI 恋爱智囊团</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.nickname}
                className="h-10 w-10 rounded-full border-2 border-pink-200"
              />
              <span className="text-gray-700">{user.nickname}</span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200"
              >
                退出登录
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 text-white transition-transform hover:scale-105"
            >
              登录
            </button>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto flex-1 px-6 py-12">
        {user ? (
          <div className="mx-auto max-w-4xl">
            {/* 欢迎区域 */}
            <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                欢迎回来，{user.nickname}！
              </h2>
              <p className="text-lg text-gray-600">
                你的 AI 代表你进行社交，多个智囊团 AI 实时监控保护你
              </p>
            </div>

            {/* 场景选择 */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">选择场景</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <SceneCard
                  icon="🎭"
                  title="AI 相亲派对"
                  description="AI 代表你参加社交活动"
                  onClick={() => alert('功能开发中')}
                />
                <SceneCard
                  icon="💬"
                  title="AI 聊天助手"
                  description="AI 帮助你与他人聊天"
                  onClick={() => alert('功能开发中')}
                />
                <SceneCard
                  icon="📊"
                  title="情感分析"
                  description="分析已有聊天记录"
                  onClick={() => alert('功能开发中')}
                />
              </div>
            </div>

            {/* 功能介绍 */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-800">核心功能</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureItem icon="🤖" text="真正的 A2A：AI 与 AI 对话" />
                <FeatureItem icon="👥" text="5 种智囊团 AI 实时监控" />
                <FeatureItem icon="🚨" text="识别红旗/绿旗信号" />
                <FeatureItem icon="🎮" text="用户可随时观察和接管" />
                <FeatureItem icon="📈" text="详细的分析报告" />
                <FeatureItem icon="🔒" text="AI 信任评分系统" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 text-6xl">💝</div>
            <h2 className="mb-4 text-4xl font-bold text-gray-800">
              AI 恋爱智囊团
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              你的 AI 代表你社交，多个智囊团 AI 实时监控保护你
            </p>
            <button
              onClick={handleLogin}
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 text-lg text-white transition-transform hover:scale-105"
            >
              使用 SecondMe 登录
            </button>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-pink-100 bg-white/80 py-6 text-center text-sm text-gray-500">
        <p>Powered by SecondMe API</p>
      </footer>
    </div>
  )
}

function SceneCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-white p-6 text-left shadow-md transition-all hover:scale-105 hover:shadow-xl"
    >
      <div className="mb-3 text-4xl">{icon}</div>
      <h4 className="mb-2 text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-gray-700">{text}</span>
    </div>
  )
}

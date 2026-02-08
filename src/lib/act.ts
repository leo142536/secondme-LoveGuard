/**
 * Act API 工具函数
 * 用于智囊团分析、风险检测等结构化判断
 */

export interface AdvisorAnalysis {
  advisor_type: 'detective' | 'emotional' | 'rational' | 'guardian' | 'humor'
  comment: string
  sentiment: 'positive' | 'neutral' | 'negative'
  suggestions: string[]
}

export interface RiskAssessment {
  risk_level: 'low' | 'medium' | 'high'
  red_flags: string[]
  green_flags: string[]
  trust_score: number
}

/**
 * 智囊团分析 actionControl 模板
 */
export function getAdvisorActionControl(advisorType: string): string {
  const templates = {
    detective: {
      description: '你是一个侦探型智囊，擅长分析行为模式，识别风险信号',
      output_schema: {
        advisor_type: 'detective',
        comment: '对对话内容的分析评论',
        sentiment: 'positive | neutral | negative',
        suggestions: ['建议1', '建议2'],
      },
    },
    emotional: {
      description: '你是一个情感型智囊，关注情感健康和情绪状态',
      output_schema: {
        advisor_type: 'emotional',
        comment: '对情感状态的分析',
        sentiment: 'positive | neutral | negative',
        suggestions: ['建议1', '建议2'],
      },
    },
    rational: {
      description: '你是一个理性型智囊，提供逻辑分析和策略建议',
      output_schema: {
        advisor_type: 'rational',
        comment: '理性分析和策略建议',
        sentiment: 'positive | neutral | negative',
        suggestions: ['建议1', '建议2'],
      },
    },
    guardian: {
      description: '你是一个守护型智囊，专注于安全保护和风险警报',
      output_schema: {
        advisor_type: 'guardian',
        comment: '安全评估和风险提示',
        sentiment: 'positive | neutral | negative',
        suggestions: ['建议1', '建议2'],
      },
    },
    humor: {
      description: '你是一个幽默型智囊，帮助缓解紧张，营造轻松氛围',
      output_schema: {
        advisor_type: 'humor',
        comment: '幽默评论和轻松建议',
        sentiment: 'positive | neutral | negative',
        suggestions: ['建议1', '建议2'],
      },
    },
  }

  const template = templates[advisorType as keyof typeof templates]
  return JSON.stringify(template)
}

/**
 * 风险检测 actionControl
 */
export function getRiskAssessmentActionControl(): string {
  return JSON.stringify({
    description: '分析对话内容，识别红旗和绿旗信号，评估风险等级',
    output_schema: {
      risk_level: 'low | medium | high',
      red_flags: ['红旗信号1', '红旗信号2'],
      green_flags: ['绿旗信号1', '绿旗信号2'],
      trust_score: '0-100 的信任评分',
    },
  })
}

/**
 * 解析 SSE 流式响应中的 JSON 结果
 */
export async function parseActStream(
  response: Response
): Promise<AdvisorAnalysis | RiskAssessment | null> {
  const reader = response.body?.getReader()
  if (!reader) return null

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 解析 SSE 格式
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return null
          }

          try {
            const json = JSON.parse(data)
            // 如果是完整的结果，返回
            if (json.advisor_type || json.risk_level) {
              return json
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error('解析 Act 流失败:', error)
  }

  return null
}

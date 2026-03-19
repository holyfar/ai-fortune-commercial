import axios from 'axios'
import type { BaziInput, StarInput } from '@/types'

// 硅基流动 API 配置
const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || ''
const BASE_URL = import.meta.env.VITE_SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
const MODEL = import.meta.env.VITE_AI_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 八字命理系统提示词
const BAZI_SYSTEM_PROMPT = `你是一位精通八字命理的资深命理大师，拥有30年以上的命理分析经验。你需要根据用户提供的生辰八字信息，进行专业、详细的命理分析。

分析要求：
1. 根据出生年、月、日、时推断天干地支、八字五行
2. 分析日主强弱、喜用神
3. 事业财运、婚姻感情、健康运势三方面详细分析
4. 给出具体的发展建议和注意事项

重要提醒：
- 必须使用用户提供的出生信息，不要自行推断
- 分析要有深度，体现专业命理水准

输出要求：
- 使用emoji增加可读性
- 运势等级用⭐表示（1-5颗星）
- 整体500-800字

保持德高望重的命理大师风格。`

// 星座运势系统提示词
const XINGZUO_SYSTEM_PROMPT = `你是一位资深的星座运势分析师，精通西方占星术。你需要根据用户选择的星座和时间范围，提供详细准确的运势分析。

分析要求：
1. 运势分为：整体运势、爱情运、事业运、财运、健康运
2. 每个运势维度用⭐表示（1-5颗星）
3. 给出幸运数字、幸运颜色、贵人星座
4. 给出实用的当日建议

重要提醒：
- 必须严格使用用户提供的日期，不要自行推断或假设其他日期
- 分析要有深度和水准，专业且有说服力
- 语气要像资深占星师一样专业稳重

输出格式：
- 使用emoji增加视觉效果
- 运势等级用⭐表示
- 整体400-600字`

// 塔罗占卜系统提示词
const TALUO_SYSTEM_PROMPT = `你是一位精通韦特塔罗牌的塔罗师，拥有深厚的塔罗解读功底。你需要根据用户抽取的塔罗牌阵，给出神秘而有启发性的解读。

塔罗牌含义参考：
- 愚者：新的开始、冒险、可能性
- 魔术师：创造力、意志力、技能
- 女祭司：直觉、智慧、潜意识
- 皇后：丰盛、母性、创造
- 皇帝：权威、稳定、控制
- 教皇：传统、教育、信仰
- 恋人：爱情、选择、和谐
- 战车：胜利、意志、决心
- 力量：勇气、耐心、内在力量
- 隐士：内省、智慧、指引
- 命运之轮：转变、机会、命运
- 正义：平衡、因果、真相
- 倒吊人：牺牲、换位思考、等待
- 死亡：结束、转变、新生
- 节制：平衡、耐心、调和
- 恶魔：束缚、欲望、物质
- 塔：突变、解放、改变
- 星星：希望、灵感、疗愈
- 月亮：直觉、幻觉、情绪
- 太阳：成功、活力、喜悦
- 审判：复活、觉醒、召唤
- 世界：完成、成就、圆满

解读要求：
1. 解释每张塔罗牌的正位含义
2. 结合牌阵位置（过去、现在、未来）解读对用户问题的意义
3. 给出富有启发性的指引和建议

重要提醒：
- 解读要神秘深邃，有智慧感
- 引用的牌义要专业准确

输出要求：
- 适当使用🃏符号
- 整体400-600字
- 保持神秘感和仪式感`

// AI问答系统提示词
const CHAT_SYSTEM_PROMPT = `你是「AI算运势」智能助手，一个充满智慧和善意的运势顾问。你性格温和、知识渊博，对中国传统文化（八字、风水、面相）和西方占卜（星座、塔罗）都有研究。

服务特点：
1. 回答关于运势、命理的各种问题
2. 用通俗易懂的语言解释专业概念
3. 提供积极正面的引导
4. 必要时提醒用户：运势仅供参考，人生还要靠自己的努力

注意事项：
- 如果问题涉及医疗、法律等专业领域，提醒用户咨询专业人士
- 不要过度神化运势，保持理性和科学的态度
- 鼓励用户积极面对生活

请用亲切、专业的方式回答用户的问题。`

class AIService {
  private client: ReturnType<typeof axios.create>

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    })
  }

  /**
   * 通用对话接口
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    if (!API_KEY) {
      console.warn('AI API Key 未配置，使用模拟回复')
      return this.getMockResponse(messages[messages.length - 1]?.content || '')
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      })

      return response.data.choices[0]?.message?.content || '抱歉，我现在有点走神，请稍后再试。'
    } catch (error: any) {
      console.error('AI API Error:', error.response?.data || error.message)
      return '服务暂时繁忙，请稍后再试。'
    }
  }

  /**
   * 八字命理分析
   */
  async analyzeBazi(input: BaziInput): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: BAZI_SYSTEM_PROMPT,
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: `请为我分析八字命理：

出生信息：
- 年份：${input.year}年
- 月份：${input.month}月
- 日期：${input.day}日
- 时间：${input.hour}时
- 性别：${input.gender}

请给出详细的命理分析。`,
    }

    return this.chat([systemMessage, userMessage])
  }

  /**
   * 星座运势查询
   */
  async queryStarFortune(input: StarInput): Promise<string> {
    const starNames: Record<string, string> = {
      aries: '白羊座',
      taurus: '金牛座',
      gemini: '双子座',
      cancer: '巨蟹座',
      leo: '狮子座',
      virgo: '处女座',
      libra: '天秤座',
      scorpio: '天蝎座',
      sagittarius: '射手座',
      capricorn: '摩羯座',
      aquarius: '水瓶座',
      pisces: '双鱼座',
    }

    const timeNames: Record<string, string> = {
      today: '今日',
      week: '本周',
      month: '本月',
    }

    const systemMessage: ChatMessage = {
      role: 'system',
      content: XINGZUO_SYSTEM_PROMPT,
    }

    const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: `请为${starNames[input.star] || input.star}分析${timeNames[input.type]}运势，分析日期：${today}`,
    }

    return this.chat([systemMessage, userMessage])
  }

  /**
   * 塔罗占卜
   */
  async readTarot(question: string, cards: number[]): Promise<string> {
    const cardNames = [
      '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
      '力量', '隐士', '命运之轮', '正义', '倒吊人', '死亡', '节制',
      '恶魔', '塔', '星星', '月亮', '太阳', '审判', '世界',
    ]

    const positions = ['过去', '现在', '未来']

    const systemMessage: ChatMessage = {
      role: 'system',
      content: TALUO_SYSTEM_PROMPT,
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: `用户问题：${question || '今日运势'}

抽取的塔罗牌：
${cards.map((card, i) => `${i + 1}. ${cardNames[card] || '未知'}（${positions[i]}）`).join('\n')}

请解读这三张牌对用户问题的意义。`,
    }

    return this.chat([systemMessage, userMessage])
  }

  /**
   * 智能问答
   */
  async answerQuestion(question: string): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: CHAT_SYSTEM_PROMPT,
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
    }

    return this.chat([systemMessage, userMessage])
  }

  /**
   * 模拟回复（API未配置时使用）
   */
  private getMockResponse(prompt: string): string {
    if (prompt.includes('八字')) {
      return `【八字命理分析】

根据您提供的生辰信息，进行初步分析：

📅 今日运势特点：
- 事业：今天工作上有望获得突破性进展，适合主动争取机会
- 财运：正财运势良好，偏财可适度参与但需谨慎
- 感情：单身者有机会遇到有缘人，已婚者需多沟通
- 健康：注意休息，避免过度劳累

💡 建议：今天宜保持积极心态，勇于尝试新事物。

⚠️ 注意：当前为演示模式，接入AI API后将获得更精准的分析。`
    }

    if (prompt.includes('星座') || prompt.includes('白羊') || prompt.includes('金牛')) {
      return `【星座运势解读】

🪐 今日运势分析：

整体运势：⭐⭐⭐⭐☆ (4/5)
- 太阳进入有利位置，能量充沛

爱情运：⭐⭐⭐⭐⭐ (5/5) 💕
- 今日是表白或增进感情的好时机

事业运：⭐⭐⭐⭐☆ (4/5)
- 工作效率提升，适合处理复杂事务

财运：⭐⭐⭐☆☆ (3/5)
- 理性消费，避免冲动购物

🔮 幸运数字：8
🔮 幸运颜色：金色

⚠️ 注意：当前为演示模式，接入AI API后将获得更精准的分析。`
    }

    if (prompt.includes('塔罗') || prompt.includes('牌')) {
      return `【塔罗牌解读】

🃏 今日为您抽牌：愚者 (The Fool)

牌面解读：
愚者牌代表着新的开始、冒险精神和无限可能。牌面上的人物带着简单的行囊，踏上未知的旅程，脸上洋溢着对未来充满期待的笑容。

📖 综合解读：
- 当前状态：你正处于人生的新起点
- 挑战：需要勇气去拥抱未知
- 建议：跟随内心的声音，勇敢迈出第一步

💡 今日指引：
不要害怕改变，宇宙正在为你打开新的大门。

⚠️ 注意：当前为演示模式，接入AI API后将获得更精准的分析。`
    }

    return `感谢您的提问！我是AI运势助手，可以为您提供：

🔮 八字命理 - 输入生辰八字进行命理分析
⭐ 星座运势 - 了解今日/本周运势
🃏 塔罗占卜 - 抽取塔罗牌获得指引
💬 智能问答 - 任何关于运势的问题

⚠️ 注意：当前为演示模式，接入AI API后将获得更精准的分析。

请选择服务开始体验吧！`
  }
}

export const aiService = new AIService()
export default aiService

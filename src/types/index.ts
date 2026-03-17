// 用户相关类型
export interface User {
  id: string
  openid?: string
  nickname?: string
  avatar?: string
  phone?: string
  memberLevel: 'free' | 'monthly' | 'yearly' | 'lifetime'
  balance: number
  freeTimes: number
  createdAt: Date
  updatedAt: Date
}

// 运势相关类型
export type FortuneType = 'bazi' | 'xingzuo' | 'taluo' | 'chat'

export interface BaziInput {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  gender: '男' | '女'
}

export interface StarInput {
  star: string
  type: 'today' | 'week' | 'month'
}

export interface TarotInput {
  question?: string
  cards: number[]
}

export interface FortuneRecord {
  id: string
  userId?: string
  type: FortuneType
  input: BaziInput | StarInput | TarotInput | string
  result: string
  createdAt: Date
}

// 支付相关类型
export interface PaymentOrder {
  id: string
  userId: string
  amount: number
  productId: string
  productName: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  paidAt?: Date
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  type: 'times' | 'membership' | 'single'
  times?: number
  duration?: number // 天数
  features: string[]
  popular?: boolean
}

// AI对话类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 会员等级
export type MemberLevel = 'free' | 'monthly' | 'yearly' | 'lifetime'

export const MEMBER_LEVELS: Record<MemberLevel, { name: string; color: string; price: number }> = {
  free: { name: '免费用户', color: '#999', price: 0 },
  monthly: { name: '月度会员', color: '#8b5cf6', price: 29.9 },
  yearly: { name: '年度会员', color: '#f59e0b', price: 299 },
  lifetime: { name: '终身会员', color: '#ef4444', price: 999 },
}

// 产品列表
export const PRODUCTS: Product[] = [
  {
    id: 'bazi-detail',
    name: '八字精批',
    description: '详细分析一生运势、事业财运、婚姻感情',
    price: 9.9,
    originalPrice: 29.9,
    type: 'single',
    features: ['五行分析', '命格解读', '事业建议', '财运分析', '婚姻配对'],
  },
  {
    id: 'bazi-lifetime',
    name: '终身运势',
    description: '完整一生运势解析，助您趋吉避凶',
    price: 29.9,
    originalPrice: 99,
    type: 'single',
    features: ['早年运势', '中年运势', '晚年运势', '大运流年', '改运建议'],
  },
  {
    id: 'star-week',
    name: '本周运势',
    description: '详细了解本周运势走向',
    price: 4.9,
    originalPrice: 9.9,
    type: 'single',
    features: ['整体运势', '爱情运势', '事业运势', '财运运势', '健康建议'],
  },
  {
    id: 'tarot-reading',
    name: '塔罗占卜',
    description: '针对问题进行深度塔罗解读',
    price: 9.9,
    originalPrice: 19.9,
    type: 'single',
    features: ['牌阵解读', '问题分析', '指引建议', '能量提示'],
  },
  {
    id: 'monthly-vip',
    name: '月度会员',
    description: '30天内无限次使用所有功能',
    price: 29.9,
    type: 'membership',
    duration: 30,
    features: ['无限AI问答', '无限八字查询', '无限星座运势', '无限塔罗占卜', '专属客服'],
  },
  {
    id: 'yearly-vip',
    name: '年度会员',
    description: '365天无限次使用，超值优惠',
    price: 299,
    originalPrice: 599,
    type: 'membership',
    duration: 365,
    features: ['所有会员权益', '优先客服', '专属头像', '生日礼包', '邀请返利'],
    popular: true,
  },
]

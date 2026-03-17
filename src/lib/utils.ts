import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 类名合并工具
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 价格格式化
 */
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

/**
 * 星座名称映射
 */
export const STAR_NAMES: Record<string, string> = {
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

/**
 * 塔罗牌名称
 */
export const TAROT_CARDS = [
  { name: '愚者', nameEn: 'The Fool', emoji: '0' },
  { name: '魔术师', nameEn: 'The Magician', emoji: 'I' },
  { name: '女祭司', nameEn: 'The High Priestess', emoji: 'II' },
  { name: '皇后', nameEn: 'The Empress', emoji: 'III' },
  { name: '皇帝', nameEn: 'The Emperor', emoji: 'IV' },
  { name: '教皇', nameEn: 'The Hierophant', emoji: 'V' },
  { name: '恋人', nameEn: 'The Lovers', emoji: 'VI' },
  { name: '战车', nameEn: 'The Chariot', emoji: 'VII' },
  { name: '力量', nameEn: 'Strength', emoji: 'VIII' },
  { name: '隐士', nameEn: 'The Hermit', emoji: 'IX' },
  { name: '命运之轮', nameEn: 'Wheel of Fortune', emoji: 'X' },
  { name: '正义', nameEn: 'Justice', emoji: 'XI' },
  { name: '倒吊人', nameEn: 'The Hanged Man', emoji: 'XII' },
  { name: '死亡', nameEn: 'Death', emoji: 'XIII' },
  { name: '节制', nameEn: 'Temperance', emoji: 'XIV' },
  { name: '恶魔', nameEn: 'The Devil', emoji: 'XV' },
  { name: '塔', nameEn: 'The Tower', emoji: 'XVI' },
  { name: '星星', nameEn: 'The Star', emoji: 'XVII' },
  { name: '月亮', nameEn: 'The Moon', emoji: 'XVIII' },
  { name: '太阳', nameEn: 'The Sun', emoji: 'XIX' },
  { name: '审判', nameEn: 'Judgement', emoji: 'XX' },
  { name: '世界', nameEn: 'The World', emoji: 'XXI' },
]

/**
 * 判断是否为移动设备
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

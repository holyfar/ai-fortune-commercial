'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Loader2 } from 'lucide-react'
import { cn, generateId, STAR_NAMES } from '@/lib/utils'
import { aiService } from '@/lib/ai-service'
import useAppStore from '@/lib/store'
import type { StarInput } from '@/types'

const STARS = [
  { value: 'aries', label: '白羊座 ♈', icon: '♈', dates: '3.21-4.19', color: '#FF6B6B' },
  { value: 'taurus', label: '金牛座 ♉', icon: '♉', dates: '4.20-5.20', color: '#4ECDC4' },
  { value: 'gemini', label: '双子座 ♊', icon: '♊', dates: '5.21-6.21', color: '#45B7D1' },
  { value: 'cancer', label: '巨蟹座 ♋', icon: '♋', dates: '6.22-7.22', color: '#96CEB4' },
  { value: 'leo', label: '狮子座 ♌', icon: '♌', dates: '7.23-8.22', color: '#FFEAA7' },
  { value: 'virgo', label: '处女座 ♍', icon: '♍', dates: '8.23-9.22', color: '#DDA0DD' },
  { value: 'libra', label: '天秤座 ♎', icon: '♎', dates: '9.23-10.23', color: '#FFB6C1' },
  { value: 'scorpio', label: '天蝎座 ♏', icon: '♏', dates: '10.24-11.22', color: '#8E44AD' },
  { value: 'sagittarius', label: '射手座 ♐', icon: '♐', dates: '11.23-12.21', color: '#E74C3C' },
  { value: 'capricorn', label: '摩羯座 ♑', icon: '♑', dates: '12.22-1.19', color: '#34495E' },
  { value: 'aquarius', label: '水瓶座 ♒', icon: '♒', dates: '1.20-2.18', color: '#00CED1' },
  { value: 'pisces', label: '双鱼座 ♓', icon: '♓', dates: '2.19-3.20', color: '#FF69B4' },
]

const TIME_TYPES = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
]

export default function XingzuoPage() {
  const [selectedStar, setSelectedStar] = useState('')
  const [timeType, setTimeType] = useState<'today' | 'week' | 'month'>('today')
  const [step, setStep] = useState(1)
  const [result, setResult] = useState('')
  const { user, addFortuneRecord, isMember, updateUser } = useAppStore()

  const handleQuery = async () => {
    if (!selectedStar) return
    if (!isMember() && (user?.freeTimes || 0) <= 0) {
      window.location.hash = '#/vip'
      return
    }
    setStep(2)
    try {
      const response = await aiService.queryStarFortune({ star: selectedStar, type: timeType })
      setResult(response)
      setStep(3)
      // 扣减免费次数
      if (!isMember() && user) {
        updateUser({ freeTimes: Math.max(0, (user.freeTimes || 0) - 1) })
      }
      addFortuneRecord({ id: generateId(), type: 'xingzuo', input: { star: selectedStar, type: timeType }, result: response, createdAt: new Date() })
    } catch (error) {
      console.error('查询失败:', error)
      setStep(1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="flex-1"><h1 className="text-lg font-bold">星座运势</h1><p className="text-white/80 text-sm">12星座 · 每日运势</p></div>
            {!isMember() && (
              <Link to="/vip" className="text-xs bg-white/20 px-2 py-1 rounded-lg">剩余{user?.freeTimes || 0}次</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">选择时间</h3>
                <div className="flex gap-2">
                  {TIME_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTimeType(type.value as any)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl font-medium transition-all",
                        timeType === type.value ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">选择星座</h3>
                <div className="grid grid-cols-4 gap-3">
                  {STARS.map((star) => (
                    <button
                      key={star.value}
                      onClick={() => setSelectedStar(star.value)}
                      className={cn(
                        "p-3 rounded-xl text-center transition-all",
                        selectedStar === star.value ? "bg-cyan-500 text-white ring-2 ring-cyan-300" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div className="text-2xl mb-1">{star.icon}</div>
                      <div className="text-xs font-medium">{star.label.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleQuery} disabled={!selectedStar} className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">查看运势</button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
              <div className="relative w-24 h-24 mb-6"><div className="absolute inset-0 border-4 border-cyan-200 rounded-full"></div><div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div><div className="absolute inset-4 bg-white rounded-full flex items-center justify-center"><Star className="w-8 h-8 text-cyan-500" /></div></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">星座运势分析中...</h3><p className="text-gray-500">探索星空的奥秘</p>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">{STARS.find(s => s.value === selectedStar)?.icon}</div>
                  <div><h2 className="text-2xl font-bold">{STAR_NAMES[selectedStar]}</h2><p className="text-white/80">{STARS.find(s => s.value === selectedStar)?.dates}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Star className="w-5 h-5 text-cyan-500" /><h3 className="font-semibold text-gray-800">{TIME_TYPES.find(t => t.value === timeType)?.label}运势</h3></div>
                <div className="prose prose-cyan max-w-none whitespace-pre-wrap text-gray-600">{result}</div>
              </div>
              <button onClick={() => setStep(1)} className="w-full mt-4 py-3 bg-cyan-500 text-white rounded-xl font-medium">再测一次</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

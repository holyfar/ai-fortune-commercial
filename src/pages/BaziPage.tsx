'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, Share2, Star, Copy } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import { aiService } from '@/lib/ai-service'
import useAppStore from '@/lib/store'
import type { BaziInput, FortuneRecord } from '@/types'

const HOUR_OPTIONS = [
  { label: '子时 (23:00-01:00)', value: 23 },
  { label: '丑时 (01:00-03:00)', value: 1 },
  { label: '寅时 (03:00-05:00)', value: 3 },
  { label: '卯时 (05:00-07:00)', value: 5 },
  { label: '辰时 (07:00-09:00)', value: 7 },
  { label: '巳时 (09:00-11:00)', value: 9 },
  { label: '午时 (11:00-13:00)', value: 11 },
  { label: '未时 (13:00-15:00)', value: 13 },
  { label: '申时 (15:00-17:00)', value: 15 },
  { label: '酉时 (17:00-19:00)', value: 17 },
  { label: '戌时 (19:00-21:00)', value: 19 },
  { label: '亥时 (21:00-23:00)', value: 21 },
]

export default function BaziPage() {
  const [step, setStep] = useState(1)
  const [input, setInput] = useState<BaziInput>({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, gender: '男' })
  const [result, setResult] = useState('')
  const { user, addFortuneRecord, isMember } = useAppStore()

  const handleSubmit = async () => {
    if (!isMember() && (user?.freeTimes || 0) <= 0) {
      window.location.href = '/vip'
      return
    }
    setStep(2)
    try {
      const response = await aiService.analyzeBazi(input)
      setResult(response)
      setStep(3)
      addFortuneRecord({ id: generateId(), type: 'bazi', input, result: response, createdAt: new Date() })
    } catch (error) {
      console.error('分析失败:', error)
      setStep(1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold">八字命理</h1>
              <p className="text-white/80 text-sm">生辰八字 · 命运解析</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">八字精批</h3>
                    <p className="text-gray-500 text-sm">AI深度分析一生运势</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["五行分析", "命格解读", "事业财运", "婚姻感情"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">
                  请输入出生信息
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      年份
                    </label>
                    <input
                      type="number"
                      value={input.year}
                      onChange={(e) =>
                        setInput({ ...input, year: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      月份
                    </label>
                    <input
                      type="number"
                      value={input.month}
                      onChange={(e) =>
                        setInput({ ...input, month: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400"
                      min={1}
                      max={12}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      日期
                    </label>
                    <input
                      type="number"
                      value={input.day}
                      onChange={(e) =>
                        setInput({ ...input, day: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400"
                      min={1}
                      max={31}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    出生时辰
                  </label>
                  <select
                    value={input.hour}
                    onChange={(e) =>
                      setInput({ ...input, hour: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400"
                  >
                    {HOUR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    性别
                  </label>
                  <div className="flex gap-3">
                    {["男", "女"].map((g) => (
                      <button
                        key={g}
                        onClick={() =>
                          setInput({ ...input, gender: g as "男" | "女" })
                        }
                        className={cn(
                          "flex-1 py-3 rounded-xl font-medium transition-all",
                          input.gender === g
                            ? "bg-pink-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                {!isMember() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                    今日剩余免费次数：{user?.freeTimes || 0} 次
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!input.year || !input.month || !input.day}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  开始分析
                </button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                命理大师正在分析...
              </h3>
              <p className="text-gray-500">根据您的生辰八字，解读命运玄机</p>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex gap-3 mb-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl text-gray-600 hover:bg-gray-50 transition">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">分享</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl text-gray-600 hover:bg-gray-50 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">复制</span>
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
                >
                  <Star className="w-4 h-4" />
                  <span className="text-sm">再测</span>
                </button>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-800">命理分析结果</h3>
                </div>
                <div className="prose prose-pink max-w-none whitespace-pre-wrap text-gray-600">
                  {result}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

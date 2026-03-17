'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, Loader2 } from 'lucide-react'
import { cn, generateId, TAROT_CARDS } from '@/lib/utils'
import { aiService } from '@/lib/ai-service'
import useAppStore from '@/lib/store'

export default function TaluoPage() {
  const [step, setStep] = useState(1)
  const [question, setQuestion] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCards, setDrawnCards] = useState<number[]>([])
  const [result, setResult] = useState('')
  const { addFortuneRecord } = useAppStore()

  const handleDraw = async () => {
    setIsDrawing(true)
    setStep(2)
    setDrawnCards([])
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      const card = Math.floor(Math.random() * 22)
      setDrawnCards(prev => [...prev, card])
    }
    setIsDrawing(false)
  }

  const handleRead = async () => {
    setStep(3)
    try {
      const response = await aiService.readTarot(question, drawnCards)
      setResult(response)
      addFortuneRecord({ id: generateId(), type: 'taluo', input: { question, cards: drawnCards }, result: response, createdAt: new Date() })
    } catch (error) {
      console.error('解读失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <header className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition"><ArrowLeft className="w-5 h-5" /></Link>
            <div><h1 className="text-lg font-bold">塔罗占卜</h1><p className="text-white/80 text-sm">神秘指引 · 智慧启迪</p></div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="prepare" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6 text-violet-600" /></div>
                  <div><h3 className="font-semibold text-gray-800">三牌阵占卜</h3><p className="text-gray-500 text-sm">过去 · 现在 · 未来</p></div>
                </div>
                <p className="text-gray-600 text-sm">闭上眼睛，深呼吸，在心中默念您的问题，然后抽取3张塔罗牌。</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">您想占卜的问题（可选）</label>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="例如：我的事业发展方向如何？" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400 resize-none" rows={3} />
              </div>
              <button onClick={handleDraw} className="w-full mt-6 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">开始抽牌</button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2].map((index) => (
                  <motion.div key={index} initial={{ rotateY: 0, scale: 0.8 }} animate={{ rotateY: drawnCards[index] !== undefined ? 180 : 0, scale: drawnCards[index] !== undefined ? 1 : 0.8 }} transition={{ duration: 0.5 }} className={cn("w-24 h-36 rounded-xl flex items-center justify-center text-4xl", drawnCards[index] !== undefined ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800" : "bg-gradient-to-br from-gray-800 to-gray-900 text-amber-400")}>
                    {drawnCards[index] !== undefined ? TAROT_CARDS[drawnCards[index]]?.emoji : <Zap className="animate-pulse" />}
                  </motion.div>
                ))}
              </div>
              {drawnCards.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {drawnCards.map((card, i) => (<div key={i} className="text-center"><div className="text-xs text-gray-500 mb-1">{['过去', '现在', '未来'][i]}</div><div className="p-3 bg-white rounded-xl shadow-sm"><div className="text-lg font-medium text-gray-800">{TAROT_CARDS[card]?.name}</div><div className="text-xs text-gray-500">{TAROT_CARDS[card]?.nameEn}</div></div></div>))}
                </div>
              )}
              {isDrawing ? (<div className="text-center py-8"><Loader2 className="w-8 h-8 mx-auto text-violet-500 animate-spin mb-3" /><p className="text-gray-600">正在抽取塔罗牌...</p></div>) : drawnCards.length === 3 ? (<button onClick={handleRead} className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl">解读牌意</button>) : null}
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-center gap-3 mb-6">
                {drawnCards.map((card, i) => (<div key={i} className="text-center"><div className="w-20 h-28 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-2"><span className="text-2xl">{TAROT_CARDS[card]?.emoji}</span></div><div className="text-xs text-gray-500">{['过去', '现在', '未来'][i]}</div></div>))}
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-violet-500" /><h3 className="font-semibold text-gray-800">塔罗指引</h3></div>
                <div className="prose prose-violet max-w-none text-gray-600 whitespace-pre-wrap">{result}</div>
              </div>
              <button onClick={() => setStep(1)} className="w-full mt-4 py-3 bg-violet-500 text-white rounded-xl font-medium">重新抽牌</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

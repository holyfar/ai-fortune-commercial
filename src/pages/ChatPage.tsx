'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, Loader2, Crown, Sparkles } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import { aiService } from '@/lib/ai-service'
import useAppStore from '@/lib/store'
import type { ChatMessage } from '@/types'

const QUICK_QUESTIONS = ['我的事业运势如何？', '本月财运怎么样？', '我的桃花运如何？', '需要注意什么健康问题？']

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', role: 'assistant', content: '您好！我是AI算运势智能助手 🤗\n\n我可以帮您解答：\n\n🔮 八字命理相关问题\n⭐ 星座运势解读\n🃏 塔罗占卜疑问\n💬 其他运势困惑\n\n有什么想问的吗？', createdAt: new Date() }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isMember } = useAppStore()

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: input.trim(), createdAt: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    try {
      const response = await aiService.answerQuestion(userMsg.content)
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: response, createdAt: new Date() }])
    } catch (error) {
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: '抱歉，服务暂时繁忙，请稍后再试。', createdAt: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => setInput(question)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex-shrink-0">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition"><ArrowLeft className="w-5 h-5" /></Link>
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /><div><h1 className="text-lg font-bold">AI问答</h1><p className="text-white/80 text-xs">智能运势顾问</p></div></div>
            </div>
            {!isMember() && <Link to="/vip" className="flex items-center gap-1 bg-amber-500 px-3 py-1.5 rounded-full text-sm"><Crown className="w-4 h-4" /><span>会员</span></Link>}
          </div>
        </div>
      </header>
      {!isMember() && (<div className="bg-amber-50 border-b border-amber-200 px-4 py-2"><div className="max-w-lg mx-auto flex items-center justify-between"><span className="text-amber-700 text-sm">今日免费次数：{user?.freeTimes || 0} 次</span><Link to="/vip" className="text-amber-600 text-sm font-medium hover:underline">开通会员无限问</Link></div></div>)}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg) => (<motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}><div className={cn("max-w-[80%] rounded-2xl px-4 py-3", msg.role === 'user' ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" : "bg-white text-gray-800 shadow-sm")}><div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div><div className={cn("text-xs mt-1", msg.role === 'user' ? "text-white/70" : "text-gray-400")}>{msg.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div></div></motion.div>))}
          {isLoading && (<div className="flex justify-start"><div className="bg-white rounded-2xl px-4 py-3 shadow-sm"><div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">AI正在思考...</span></div></div></div>)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {messages.length === 1 && (<div className="px-4 pb-2"><div className="max-w-lg mx-auto flex flex-wrap gap-2">{QUICK_QUESTIONS.map((q) => (<button key={q} onClick={() => handleQuickQuestion(q)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition">{q}</button>))}</div></div>)}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="max-w-lg mx-auto flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="输入您的问题..." className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  )
}

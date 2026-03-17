'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Star, Gem, MessageCircle, Crown, ChevronRight, Zap, Shield, Gift } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCTS } from '@/types'
import useAppStore from '@/lib/store'

const NAV_ITEMS = [
  { id: 'home', label: '首页', icon: Sparkles, href: '/' },
  { id: 'bazi', label: '八字', icon: Gem, href: '/bazi' },
  { id: 'xingzuo', label: '星座', icon: Star, href: '/xingzuo' },
  { id: 'taluo', label: '塔罗', icon: Gem, href: '/taluo' },
  { id: 'chat', label: '问答', icon: MessageCircle, href: '/chat' },
  { id: 'vip', label: '会员', icon: Crown, href: '/vip' },
]

const FEATURE_CARDS = [
  { id: 'bazi', title: '八字命理', description: '输入生辰八字，AI为您深度解析命运走向', icon: Gem, gradient: 'from-pink-500 to-rose-500', href: '/bazi', popular: false },
  { id: 'xingzuo', title: '星座运势', description: '12星座每日运势详解，了解今日运势密码', icon: Star, gradient: 'from-cyan-500 to-blue-500', href: '/xingzuo', popular: false },
  { id: 'taluo', title: '塔罗占卜', description: '抽取塔罗牌，获得神秘力量的指引', icon: Zap, gradient: 'from-violet-500 to-purple-500', href: '/taluo', popular: true },
  { id: 'chat', title: 'AI问答', description: '有任何运势问题，AI随时为您解答', icon: MessageCircle, gradient: 'from-emerald-500 to-teal-500', href: '/chat', popular: false },
]

export default function HomePage() {
  const [activeNav, setActiveNav] = useState('home')
  const { user, isMember } = useAppStore()

  return (
    <div className="min-h-screen pb-20">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-violet-600 text-white">
        <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI算运势</h1>
                <p className="text-primary-100 text-sm">智能解读 · 洞悉未来</p>
              </div>
            </div>
            {isMember() ? (
              <Link href="/vip" className="flex items-center gap-1 bg-gold-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                <span>会员</span>
              </Link>
            ) : (
              <Link to="/vip" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition">
                <Crown className="w-4 h-4" />
                <span>开通会员</span>
              </Link>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-100 text-sm">今日运势</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">♈</div>
              <div className="flex-1">
                <div className="font-semibold">白羊座</div>
                <div className="text-sm text-primary-100">今日运势评分：4.5/5</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {FEATURE_CARDS.map((card, index) => (
            <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Link to={card.href}>
                <div className={cn("group relative overflow-hidden rounded-2xl p-5 text-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1", `bg-gradient-to-br ${card.gradient}`)}>
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                  {card.popular && <span className="absolute top-2 right-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">热门</span>}
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur"><card.icon className="w-6 h-6" /></div>
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-100">
          <Link to="/vip">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"><Crown className="w-7 h-7 text-white" /></div>
                <div><h3 className="font-bold text-lg text-gray-800">开通会员</h3><p className="text-gray-500 text-sm">享无限次AI问答</p></div>
              </div>
              <div className="flex items-center gap-1 text-primary-600"><span className="text-sm font-medium">立即开通</span><ChevronRight className="w-4 h-4" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-200/50">
              <div className="text-center"><Zap className="w-5 h-5 mx-auto text-amber-500 mb-1" /><span className="text-xs text-gray-600">无限次数</span></div>
              <div className="text-center"><Shield className="w-5 h-5 mx-auto text-amber-500 mb-1" /><span className="text-xs text-gray-600">专属客服</span></div>
              <div className="text-center"><Gift className="w-5 h-5 mx-auto text-amber-500 mb-1" /><span className="text-xs text-gray-600">优惠活动</span></div>
            </div>
          </Link>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">热门付费服务</h2>
          <div className="space-y-3">
            {PRODUCTS.filter(p => p.popular || p.type === 'single').slice(0, 3).map((product) => (
              <Link key={product.id} to="#">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", product.type === 'membership' ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-primary-500 to-violet-600")}><Gem className="w-6 h-6 text-white" /></div>
                  <div className="flex-1"><h4 className="font-medium text-gray-800">{product.name}</h4><p className="text-gray-500 text-sm">{product.description}</p></div>
                  <div className="text-right"><div className="text-primary-600 font-bold">{formatPrice(product.price)}</div>{product.originalPrice && <div className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</div>}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">今日免费次数</h3>
            <Link to="/vip" className="text-sm text-primary-600 hover:underline">开通会员</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1"><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all" style={{ width: `${((user?.freeTimes || 0) / 3) * 100}%` }}></div></div></div>
            <span className="text-primary-600 font-semibold">{user?.freeTimes || 0}/3</span>
          </div>
        </motion.section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-pb">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} to={item.href} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors", activeNav === item.id ? "text-primary-600" : "text-gray-400 hover:text-gray-600")} onClick={() => setActiveNav(item.id)}>
              <item.icon className={cn("w-5 h-5", activeNav === item.id && "fill-primary-600")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

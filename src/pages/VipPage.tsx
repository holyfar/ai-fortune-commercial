'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Crown, Check, Zap, Shield, Gift, Star } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCTS, MEMBER_LEVELS } from '@/types'
import useAppStore from '@/lib/store'

const BENEFITS = [
  { icon: Zap, title: '无限次数', desc: '所有功能无限使用' },
  { icon: Star, title: '专属服务', desc: '优先客服响应' },
  { icon: Gift, title: '专属福利', desc: '会员专属活动' },
  { icon: Shield, title: '安全保障', desc: '数据隐私保护' },
]

export default function VipPage() {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('yearly')
  const { user, isMember } = useAppStore()

  const memberProducts = PRODUCTS.filter(p => p.type === 'membership')
  const selectedProduct = memberProducts.find(p => p.id === `${selectedDuration}-vip`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition"><ArrowLeft className="w-5 h-5" /></Link>
            <div><h1 className="text-lg font-bold">开通会员</h1><p className="text-white/80 text-sm">尊享特权 · 无限可能</p></div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 -mt-4 relative">
        {isMember() ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><Crown className="w-8 h-8" /></div>
              <div><h2 className="text-xl font-bold">您已是会员</h2><p className="text-white/80">感谢您的支持，期待为您带来更多价值</p></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20"><div className="flex items-center justify-between"><span className="text-white/80">会员等级：</span><span className="font-semibold">{MEMBER_LEVELS[user?.memberLevel || 'free'].name}</span></div></div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><Crown className="w-8 h-8" /></div>
              <div><h2 className="text-xl font-bold">开通会员</h2><p className="text-white/80">解锁无限可能，畅享所有功能</p></div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">会员权益</h3>
          <div className="grid grid-cols-2 gap-4">
            {BENEFITS.map((benefit, i) => (<motion.div key={benefit.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><benefit.icon className="w-5 h-5 text-amber-600" /></div>
              <div><div className="font-medium text-gray-800">{benefit.title}</div><div className="text-xs text-gray-500">{benefit.desc}</div></div>
            </motion.div>))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">选择套餐</h3>
          <div className="flex gap-3 mb-4">
            {memberProducts.map((product) => (<button key={product.id} onClick={() => setSelectedDuration(product.id.includes('yearly') ? 'yearly' : 'monthly')} className={cn("flex-1 py-3 rounded-xl border-2 transition-all", (product.id.includes('yearly') ? 'yearly' : 'monthly') === selectedDuration ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300")}>
              <div className="font-semibold text-gray-800">{product.name}</div><div className="text-sm text-gray-500">{product.duration}天</div>
            </button>))}
          </div>
          {selectedProduct && (<div className="text-center py-4"><div className="flex items-center justify-center gap-2"><span className="text-4xl font-bold text-amber-600">{formatPrice(selectedProduct.price)}</span>{selectedProduct.originalPrice && <span className="text-lg text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>}</div><div className="text-sm text-gray-500 mt-1">每天仅需 {formatPrice(selectedProduct.price / (selectedProduct.duration || 30))}</div></div>)}
        </div>

        {!isMember() && (<motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">立即开通</motion.button>)}

        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">单次付费</h3>
          <div className="space-y-3">
            {PRODUCTS.filter(p => p.type === 'single').map((product) => (<Link key={product.id} to="#"><div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center"><Star className="w-6 h-6 text-white" /></div>
              <div className="flex-1"><h4 className="font-medium text-gray-800">{product.name}</h4><p className="text-gray-500 text-sm">{product.description}</p></div>
              <div className="text-right"><div className="text-primary-600 font-bold">{formatPrice(product.price)}</div>{product.originalPrice && <div className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</div>}</div>
            </div></Link>))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">常见问题</h3>
          <div className="space-y-3">
            {[{ q: '会员可以退款吗？', a: '付费产品不支持退款，会员可随时取消自动续费' }, { q: '如何成为会员？', a: '点击上方开通按钮，选择支付方式完成支付即可' }, { q: '会员有效期多长？', a: '月度会员30天，年度会员365天，终身会员永久有效' }].map((faq, i) => (<details key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden"><summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer">{faq.q}</summary><div className="px-4 pb-3 text-gray-500 text-sm">{faq.a}</div></details>))}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs pb-8"><p>支付安全由微信支付/支付宝保障</p><p className="mt-1">用户协议 · 隐私政策</p></div>
      </main>
    </div>
  )
}

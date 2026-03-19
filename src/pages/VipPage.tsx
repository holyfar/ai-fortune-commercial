'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Crown, Check, Zap, Shield, Gift, Star, X, MessageCircle, Copy, User } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCTS } from '@/types'
import useAppStore from '@/lib/store'
import { getUserId } from '@/lib/cloudbase'

const BENEFITS = [
  { icon: Zap, title: '无限次数', desc: '所有功能无限使用' },
  { icon: Star, title: '专属服务', desc: '优先客服响应' },
  { icon: Gift, title: '专属福利', desc: '会员专属活动' },
  { icon: Shield, title: '安全保障', desc: '数据隐私保护' },
]

export default function VipPage() {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('yearly')
  const [showContactModal, setShowContactModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const { user, isMember, upgradeMember } = useAppStore()

  // 这里改成你的微信号
  const WECHAT_ID = 'wwy421421'
  const userId = getUserId()
  const [copiedId, setCopiedId] = useState(false)

  const copyUserId = () => {
    navigator.clipboard.writeText(userId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const memberProducts = PRODUCTS.filter(p => p.type === 'membership')
  const selectedProduct = memberProducts.find(p => p.id === (selectedDuration === 'yearly' ? 'yearly-vip' : 'monthly-vip'))

  const handlePurchase = () => {
    setShowContactModal(true)
  }

  const copyWechatId = () => {
    navigator.clipboard.writeText(WECHAT_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-20">
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
            <div className="mt-4 pt-4 border-t border-white/20"><div className="flex items-center justify-between"><span className="text-white/80">会员等级：</span><span className="font-semibold">{user?.memberLevel === 'yearly' ? '年度会员' : user?.memberLevel === 'monthly' ? '月度会员' : '终身会员'}</span></div></div>
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
            {memberProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedDuration(product.id.includes('yearly') ? 'yearly' : 'monthly')}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all relative",
                  (product.id.includes('yearly') ? 'yearly' : 'monthly') === selectedDuration 
                    ? "border-amber-500 bg-amber-50" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {product.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    超值
                  </span>
                )}
                <div className="font-semibold text-gray-800">{product.name}</div>
                <div className="text-sm text-gray-500">{product.duration}天</div>
              </button>
            ))}
          </div>
          {selectedProduct && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-amber-600">{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                每天仅需 {formatPrice(selectedProduct.price / (selectedProduct.duration || 30))}
              </div>
            </div>
          )}
        </div>

        {!isMember() && (
          <motion.button 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={handlePurchase}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            立即开通
          </motion.button>
        )}

        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">单次付费</h3>
          <div className="space-y-3">
            {PRODUCTS.filter(p => p.type === 'single').map((product) => (
              <div 
                key={product.id}
                onClick={handlePurchase}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-primary-600 font-bold">{formatPrice(product.price)}</div>
                  {product.originalPrice && (
                    <div className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-4">常见问题</h3>
          <div className="space-y-3">
            {[
              { q: '会员可以退款吗？', a: '付费产品不支持退款，会员可随时取消自动续费' },
              { q: '如何成为会员？', a: '点击上方开通按钮，添加客服微信完成支付即可' },
              { q: '会员有效期多长？', a: '月度会员30天，年度会员365天，终身会员永久有效' }
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer">{faq.q}</summary>
                <div className="px-4 pb-3 text-gray-500 text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* 用户ID显示 */}
        <div className="mt-8 bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">您的用户ID</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={userId} 
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 font-mono"
            />
            <button 
              onClick={copyUserId}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                copiedId 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {copiedId ? '已复制' : '复制'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">联系客服时请提供此ID，以便为您开通会员</p>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs pb-8">
          <p>支付安全 · 诚信经营</p>
          <p className="mt-1">用户协议 · 隐私政策</p>
        </div>
      </main>

      {/* 联系客服弹窗 */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">联系客服开通</h3>
                <button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="text-center mb-6">
                <img 
                  src="/vx.png" 
                  alt="微信二维码" 
                  className="w-32 h-32 mx-auto mb-4 object-contain rounded-xl"
                />
                <p className="text-gray-600 text-sm mb-2">扫码添加客服微信</p>
                <p className="text-xs text-gray-400">（请备注"开通会员"）</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 text-center mb-3">或搜索微信号</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={WECHAT_ID} 
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center text-gray-800"
                  />
                  <button 
                    onClick={copyWechatId}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all",
                      copied 
                        ? "bg-green-500 text-white" 
                        : "bg-amber-500 text-white hover:bg-amber-600"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">开通流程</p>
                    <ol className="text-green-700 text-xs space-y-1">
                      <li>1. 添加客服微信</li>
                      <li>2. 说明要开通的会员类型</li>
                      <li>3. 微信转账后立即开通</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* 测试开通按钮 - 仅供测试使用 */}
              <button
                onClick={() => {
                  upgradeMember(selectedDuration)
                  setShowContactModal(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl mb-3"
              >
                测试开通 {selectedDuration === 'yearly' ? '年度会员' : '月度会员'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                服务时间：周一至周日 9:00-21:00
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

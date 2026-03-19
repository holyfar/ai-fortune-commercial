import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, FortuneRecord, ChatMessage, FortuneType } from '@/types'
import { getUserId, checkMemberStatus, saveLocalMemberInfo } from './cloudbase'

interface AppState {
  // 用户状态
  user: User | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  initUserFromCloud: () => Promise<void>

  // 会员状态
  isVip: boolean
  isMember: () => boolean
  upgradeMember: (level: 'monthly' | 'yearly' | 'lifetime') => void

  // 历史记录
  fortuneHistory: FortuneRecord[]
  addFortuneRecord: (record: FortuneRecord) => void
  clearHistory: () => void

  // 聊天会话
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void

  // UI状态
  isLoading: boolean
  setLoading: (loading: boolean) => void
  currentPage: string
  setCurrentPage: (page: string) => void

  // 支付相关
  showPayModal: boolean
  setShowPayModal: (show: boolean) => void
  selectedProduct: any
  setSelectedProduct: (product: any) => void
}

// 免费用户初始数据
const defaultUser: User = {
  id: '',
  memberLevel: 'free',
  balance: 0,
  freeTimes: 3, // 每天3次免费机会
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 用户状态
      user: defaultUser,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      initUserFromCloud: async () => {
        const userId = getUserId()
        const memberStatus = await checkMemberStatus()
        
        if (memberStatus && memberStatus.isMember && memberStatus.memberLevel) {
          set({
            user: {
              id: userId,
              memberLevel: memberStatus.memberLevel as 'monthly' | 'yearly' | 'lifetime',
              balance: 0,
              freeTimes: 999,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            isVip: true,
          })
        }
      },

      // 会员状态
      isVip: false,
      isMember: () => {
        const user = get().user
        if (!user) return false
        return ['monthly', 'yearly', 'lifetime'].includes(user.memberLevel)
      },
      upgradeMember: (level) => {
        // 保存到本地存储
        saveLocalMemberInfo(level)
        set((state) => ({
          user: state.user ? { ...state.user, memberLevel: level, freeTimes: 999 } : null,
          isVip: true,
        }))
      },

      // 历史记录
      fortuneHistory: [],
      addFortuneRecord: (record) =>
        set((state) => ({
          fortuneHistory: [record, ...state.fortuneHistory].slice(0, 100), // 保留最近100条
        })),
      clearHistory: () => set({ fortuneHistory: [] }),

      // 聊天
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),
      clearChat: () => set({ chatMessages: [] }),

      // UI状态
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),

      // 支付
      showPayModal: false,
      setShowPayModal: (show) => set({ showPayModal: show }),
      selectedProduct: null,
      setSelectedProduct: (product) => set({ selectedProduct: product }),
    }),
    {
      name: 'ai-fortune-storage',
      partialize: (state) => ({
        user: state.user,
        fortuneHistory: state.fortuneHistory,
        chatMessages: state.chatMessages,
      }),
    }
  )
)

export default useAppStore

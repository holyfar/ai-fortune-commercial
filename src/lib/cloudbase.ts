// CloudBase 数据库操作
import cloudbase from '@cloudbase/js-sdk'

// 初始化 CloudBase
const app = cloudbase.init({
  env: 'ai-fortune-8g6l03mn90defc56',
})

// 匿名登录
let authInitialized = false
async function ensureAuth() {
  if (!authInitialized) {
    try {
      await app.auth({ persistence: 'local' }).anonymousAuthProvider().signIn()
      authInitialized = true
    } catch (e) {
      console.error('匿名登录失败:', e)
    }
  }
}

// 获取用户唯一标识（设备ID）
export function getUserId(): string {
  const STORAGE_KEY = 'ai_fortune_user_id'

  let userId = localStorage.getItem(STORAGE_KEY)
  if (!userId) {
    userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    localStorage.setItem(STORAGE_KEY, userId)
  }

  return userId
}

// 保存会员信息到本地存储
export function saveLocalMemberInfo(memberLevel: string): void {
  localStorage.setItem('member_level', memberLevel)
}

// 获取会员信息（从本地存储）
export function getLocalMemberInfo(): { memberLevel: string | null } {
  const memberLevel = localStorage.getItem('member_level')
  return { memberLevel }
}

// 检查会员状态（从云数据库读取）
export async function checkMemberStatus(): Promise<{
  isMember: boolean
  memberLevel: string | null
  expireTime: Date | null
} | null> {
  try {
    const userId = getUserId()

    // 先检查本地存储
    const { memberLevel: localLevel } = getLocalMemberInfo()
    if (localLevel && ['monthly', 'yearly', 'lifetime'].includes(localLevel)) {
      return {
        isMember: true,
        memberLevel: localLevel,
        expireTime: null
      }
    }

    // 确保已登录
    await ensureAuth()

    // 从云数据库查询
    const db = app.database()
    const res = await db.collection('members').where({
      userId: userId
    }).get()

    if (res.data && res.data.length > 0) {
      const member = res.data[0]
      // 同步到本地存储
      saveLocalMemberInfo(member.memberLevel)
      return {
        isMember: true,
        memberLevel: member.memberLevel,
        expireTime: member.expireTime ? new Date(member.expireTime) : null
      }
    }

    return { isMember: false, memberLevel: null, expireTime: null }
  } catch (error) {
    console.error('检查会员状态失败:', error)
    // 如果云数据库读取失败，尝试本地存储
    const { memberLevel } = getLocalMemberInfo()
    if (memberLevel && ['monthly', 'yearly', 'lifetime'].includes(memberLevel)) {
      return {
        isMember: true,
        memberLevel,
        expireTime: null
      }
    }
    return null
  }
}

// 数据库操作函数
export async function getMembersFromDB(): Promise<any[]> {
  try {
    await ensureAuth()
    const db = app.database()
    const res = await db.collection('members').get()
    return res.data || []
  } catch (error) {
    console.error('获取会员列表失败:', error)
    return []
  }
}

export async function addMemberToDB(data: { userId: string; memberLevel: string; expireTime?: string }): Promise<boolean> {
  try {
    const db = app.database()
    const now = new Date().toISOString()
    await db.collection('members').add({
      data: {
        ...data,
        createdAt: now,
        updatedAt: now,
      }
    })
    return true
  } catch (error) {
    console.error('添加会员失败:', error)
    return false
  }
}

export async function updateMemberInDB(_id: string, data: { userId?: string; memberLevel?: string; expireTime?: string }): Promise<boolean> {
  try {
    const db = app.database()
    const updateData: any = { updatedAt: new Date().toISOString() }
    if (data.userId) updateData.userId = data.userId
    if (data.memberLevel) updateData.memberLevel = data.memberLevel
    if (data.expireTime !== undefined) updateData.expireTime = data.expireTime

    await db.collection('members').doc(_id).update({ data: updateData })
    return true
  } catch (error) {
    console.error('更新会员失败:', error)
    return false
  }
}

export async function deleteMemberFromDB(_id: string): Promise<boolean> {
  try {
    const db = app.database()
    await db.collection('members').doc(_id).remove()
    return true
  } catch (error) {
    console.error('删除会员失败:', error)
    return false
  }
}

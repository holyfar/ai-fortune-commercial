// 模拟数据库操作（Web SDK 有兼容问题）
// 实际数据库操作请通过 AI 助手或腾讯云控制台完成

const STORAGE_KEY = 'admin_members'

export async function getMembersFromDB(): Promise<any[]> {
  // 尝试从本地存储读取
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('读取失败:', e)
  }
  return []
}

export async function addMemberToDB(data: { userId: string; memberLevel: string; expireTime?: string }): Promise<boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let members = stored ? JSON.parse(stored) : []
    const newMember = {
      _id: 'member_' + Date.now().toString(36),
      ...data,
      createdAt: new Date().toISOString()
    }
    members.push(newMember)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    return true
  } catch (e) {
    console.error('添加失败:', e)
    return false
  }
}

export async function updateMemberInDB(_id: string, data: { userId?: string; memberLevel?: string; expireTime?: string }): Promise<boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let members = stored ? JSON.parse(stored) : []
    members = members.map((m: any) => m._id === _id ? { ...m, ...data } : m)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    return true
  } catch (e) {
    console.error('更新失败:', e)
    return false
  }
}

export async function deleteMemberFromDB(_id: string): Promise<boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let members = stored ? JSON.parse(stored) : []
    members = members.filter((m: any) => m._id !== _id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
    return true
  } catch (e) {
    console.error('删除失败:', e)
    return false
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

// 获取会员信息（从本地存储）
export function getLocalMemberInfo(): { memberLevel: string | null } {
  const memberLevel = localStorage.getItem('member_level')
  return { memberLevel }
}

// 保存会员信息到本地存储
export function saveLocalMemberInfo(memberLevel: string): void {
  localStorage.setItem('member_level', memberLevel)
}

// 检查会员状态（本地存储版本）
export async function checkMemberStatus(): Promise<{
  isMember: boolean
  memberLevel: string | null
  expireTime: Date | null
} | null> {
  try {
    const userId = getUserId()
    const { memberLevel } = getLocalMemberInfo()
    
    if (memberLevel && ['monthly', 'yearly', 'lifetime'].includes(memberLevel)) {
      return {
        isMember: true,
        memberLevel,
        expireTime: null
      }
    }
    
    return { isMember: false, memberLevel: null, expireTime: null }
  } catch (error) {
    console.error('检查会员状态失败:', error)
    return null
  }
}

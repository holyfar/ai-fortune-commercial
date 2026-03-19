const cloud = require('tcb-admin-node')

cloud.init({
  env: 'ai-fortune-8g6l03mn90defc56',
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { userId } = event

  if (!userId) {
    return { isMember: false, memberLevel: null, expireTime: null }
  }

  try {
    const result = await db.collection('members')
      .where({
        userId: userId
      })
      .get()

    if (result.data && result.data.length > 0) {
      const member = result.data[0]
      
      // 检查是否过期（终身会员不过期）
      if (member.memberLevel !== 'lifetime' && member.expireTime) {
        const expireDate = new Date(member.expireTime)
        if (expireDate < new Date()) {
          return { isMember: false, memberLevel: null, expireTime: null }
        }
      }
      
      return {
        isMember: true,
        memberLevel: member.memberLevel,
        expireTime: member.expireTime || null
      }
    }

    return { isMember: false, memberLevel: null, expireTime: null }
  } catch (error) {
    console.error('查询会员失败:', error)
    return { isMember: false, memberLevel: null, expireTime: null, error: error.message }
  }
}

const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 设置CORS
const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.main = async (event, context) => {
  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: responseHeaders,
      body: ''
    }
  }

  const { action, data } = event

  try {
    let result
    
    switch (action) {
      case 'list': {
        const res = await db.collection('members').get()
        result = { code: 0, data: res.data }
        break
      }
      
      case 'add': {
        const { userId, memberLevel, expireTime } = data
        const now = new Date().toISOString()
        const res = await db.collection('members').add({
          data: {
            userId,
            memberLevel: memberLevel || 'yearly',
            expireTime: expireTime || null,
            createdAt: now,
            updatedAt: now,
          }
        })
        result = { code: 0, data: res }
        break
      }
      
      case 'update': {
        const { _id, userId, memberLevel, expireTime } = data
        const updateData = { updatedAt: new Date().toISOString() }
        if (userId) updateData.userId = userId
        if (memberLevel) updateData.memberLevel = memberLevel
        if (expireTime !== undefined) updateData.expireTime = expireTime
        
        await db.collection('members').doc(_id).update({ data: updateData })
        result = { code: 0, message: '更新成功' }
        break
      }
      
      case 'delete': {
        const { _id } = data
        await db.collection('members').doc(_id).remove()
        result = { code: 0, message: '删除成功' }
        break
      }
      
      default:
        result = { code: -1, message: '未知操作' }
    }
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(result)
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ code: -1, message: err.message })
    }
  }
}

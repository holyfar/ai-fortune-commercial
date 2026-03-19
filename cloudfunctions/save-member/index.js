const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { userId, memberLevel, expireTime, _id } = event

  if (!userId || !memberLevel) {
    return {
      code: -1,
      message: '缺少必要参数'
    }
  }

  try {
    const data = {
      userId,
      memberLevel,
      expireTime: expireTime || null,
      createdAt: new Date().toISOString()
    }

    if (_id) {
      // 更新
      await db.collection('members').doc(_id).update({
        data: {
          userId,
          memberLevel,
          expireTime: expireTime || null,
        }
      })
    } else {
      // 添加
      await db.collection('members').add({
        data
      })
    }

    return {
      code: 0,
      message: 'success'
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    }
  }
}

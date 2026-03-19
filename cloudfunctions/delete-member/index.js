const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event

  if (!id) {
    return {
      code: -1,
      message: '缺少必要参数'
    }
  }

  try {
    await db.collection('members').doc(id).remove()
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

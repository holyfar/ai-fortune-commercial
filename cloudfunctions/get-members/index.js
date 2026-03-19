const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const result = await db.collection('members').get()
    return {
      code: 0,
      data: result.data
    }
  } catch (err) {
    return {
      code: -1,
      message: err.message
    }
  }
}

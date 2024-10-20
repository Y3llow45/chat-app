const User = require('../models/User')

const findUsers = async (friendUsername, requesterUsername) => {
  try {
    const friend = await User.findOne({ username: friendUsername })
    const requester = await User.findOne({ username: requesterUsername })

    if (!friend || !requester) {
      return { error: 'User not found', status: 404 }
    }

    return { friend, requester }
  } catch (error) {
    return { error: 'Server error', status: 500 }
  }
};

module.exports = findUsers

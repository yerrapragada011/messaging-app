const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { receiverId: req.user.id },
      include: { sender: true, receiver: true }
    })
    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getProfile, getMessages }

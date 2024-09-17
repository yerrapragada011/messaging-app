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

const updateProfile = async (req, res) => {
  const { email, bio } = req.body
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { email }
    })

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: { bio },
      create: { userId: req.user.id, bio }
    })

    res.json({ user: updatedUser, profile: updatedProfile })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { getProfile, getMessages, updateProfile }

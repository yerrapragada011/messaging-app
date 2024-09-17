const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sendMessage = async (req, res) => {
  const { recipientId, content } = req.body

  if (!recipientId || !content) {
    return res
      .status(400)
      .json({ message: 'Recipient ID and message content are required' })
  }

  const recipientIdInt = parseInt(recipientId, 10)
  if (isNaN(recipientIdInt)) {
    return res.status(400).json({ message: 'Invalid Recipient ID' })
  }

  try {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientIdInt }
    })
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' })
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: recipientIdInt,
        content
      }
    })

    res.status(201).json(message)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ message: 'Failed to send message' })
  }
}

const userList = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true
      }
    })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}

const deleteMessage = async (req, res) => {
  const { messageId } = req.params

  try {
    const message = await prisma.message.delete({
      where: {
        id: parseInt(messageId, 10)
      }
    })

    res
      .status(200)
      .json({ message: 'Message deleted successfully', data: message })
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ message: 'Failed to delete message' })
  }
}

module.exports = { sendMessage, userList, deleteMessage }

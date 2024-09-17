const express = require('express')
const {
  sendMessage,
  userList,
  deleteMessage
} = require('../controllers/messageController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/', ensureAuthenticated, sendMessage)

router.get('/users', ensureAuthenticated, userList)

router.delete('/:messageId', ensureAuthenticated, deleteMessage)

module.exports = router

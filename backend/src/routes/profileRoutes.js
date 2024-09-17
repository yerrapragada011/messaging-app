const express = require('express')
const {
  getProfile,
  getMessages,
  updateProfile
} = require('../controllers/profileController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.get('/', ensureAuthenticated, getProfile)
router.get('/messages', ensureAuthenticated, getMessages)
router.put('/', ensureAuthenticated, updateProfile)

module.exports = router

const express = require('express')
const { getProfile, getMessages } = require('../controllers/profileController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.get('/', ensureAuthenticated, getProfile)
router.get('/messages', ensureAuthenticated, getMessages)

module.exports = router

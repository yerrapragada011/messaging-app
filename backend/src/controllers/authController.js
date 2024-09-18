const bcrypt = require('bcrypt')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const register = async (req, res) => {
  const { username, password, email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  const existingUser = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email
      }
    })
    res.redirect('/')
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(400).json({ message: 'Login failed', info })
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error logging in:', err)
        return next(err)
      }
      console.log('Session after login:', req.session)
      console.log('Cookie headers:', req.get('set-cookie'))
      res.redirect('/profile')
    })
  })(req, res, next)
}

module.exports = { register, login }

const bcrypt = require('bcrypt')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const register = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { username, password: hashedPassword }
  })
  res.redirect('/login')
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
        return next(err)
      }
      return res.status(200).json({ message: 'Login successful', user })
    })
  })(req, res, next)
}

module.exports = { register, login }

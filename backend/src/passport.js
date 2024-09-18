const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } })
      if (!user) return done(null, false, { message: 'Incorrect username.' })

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) return done(null, false, { message: 'Incorrect password.' })

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } })
  return done(null, user)
})

module.exports = passport

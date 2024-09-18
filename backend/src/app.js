require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const passport = require('./passport')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()

app.use(
  cors({
    origin: 'https://messaging-app-mauve.vercel.app',
    credentials: true
  })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.set('trust proxy', 1)
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'session'
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', authRoutes)
app.use('/profile', profileRoutes)
app.use('/send-message', messageRoutes)

const PORT = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, '../../frontend/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

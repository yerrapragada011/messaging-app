function ensureAuthenticated(req, res, next) {
  console.log('Authenticated:', req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ message: 'Unauthorized' })
}

module.exports = { ensureAuthenticated }

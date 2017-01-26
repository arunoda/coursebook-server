const passport = require('passport')
const initLoginStrategies = require('./strategies')
const uuid = require('uuid')
const url = require('url')

module.exports = function (app, db) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (_id, done) {
    db.collection('users').findOne({_id})
      .then((user) => (done(null, user)))
      .catch((ex) => (done(ex)))
  })

  app.use((req, res, next) => {
    // Save the redirectUrl on the session.
    // So, we can use it later when redirecting.
    if (req.query.appRedirectUrl) {
      req.session.appRedirectUrl = req.query.appRedirectUrl
    }

    // User asks for a login token instead of authenticating over cookies.
    // We need to provide that.
    if (req.query.needToken) {
      req.session.needToken = true
    }

    next()
  })

  initLoginStrategies(app, db, (req, res) => {
    const userId = req.user._id
    if (req.session.needToken) {
      req.logout('/')
      const token = uuid.v4()
      const query = { _id: userId }
      const modifiers = { $push: { 'loginTokens': token } }
      db.collection('users').update(query, modifiers)
        .then(() => redirect(token))
        .catch((ex) => {
          console.error(ex.stack)
          res.status(500).send('Internal Error')
        })
    } else {
      redirect()
    }

    function redirect (token) {
      const appRedirectUrl = req.session.appRedirectUrl || '/logincheck'
      const parsedUrl = url.parse(appRedirectUrl, true)

      if (token) {
        parsedUrl.query['loginToken'] = token
      }

      const newRedirectUrl = url.format(parsedUrl)
      req.session.appRedirectUrl = null
      req.session.needToken = null
      res.redirect(newRedirectUrl)
    }
  })

  app.get('/logout', (req, res) => {
    if (!req.user) return redirect()

    const userId = req.user._id
    req.logout('/')

    db.collection('users').update({ _id: userId }, { $unset: { 'loginTokens': true } })
      .then(redirect)
      .catch((ex) => {
        console.error(ex.stack)
        res.status(500).send('Internal Error')
      })

    function redirect () {
      const appRedirectUrl = req.query.appRedirectUrl || '/logincheck'
      res.redirect(appRedirectUrl)
    }
  })

  // Client side app can use this to check the authentication.
  app.get('/logincheck', (req, res) => {
    if (req.user) {
      return res.json({loggedIn: true, userId: req.user._id})
    }

    return res.json({loggedIn: false})
  })
}

const passport = require('passport')
const GitHubStrategy = require('passport-github2')

module.exports = function (app, db, onLoginSuccess) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.ROOT_URL}/login/github/callback`
  },
    function (accessToken, refreshToken, profile, done) {
      // We need to save these stuff in the DB and return the user object.
      const id = `github-${profile.username}`
      const user = {
        _id: id,
        'strategies.github': {
          profile,
          refreshToken,
          accessToken
        },
        updatedAt: new Date()
      }

      db.collection('users')
        .update({ _id: id }, { $set: user }, { upsert: true })
        .then(() => done(null, user))
        .catch((ex) => done(ex))
    }
  ))

  const loginScopes = [
    'user:email'
  ]

  app.get('/login/github',
    passport.authenticate('github', { scope: loginScopes })
  )

  app.get('/login/github/callback',
    passport.authenticate('github'),
    function (req, res) {
      onLoginSuccess(req, res)
    }
  )
}

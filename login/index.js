const passport = require('passport');
const initLoginStrategies = require('./strategies');

module.exports = function(app, db) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(_id, done) {
    db.collection('users').findOne({_id})
      .then((user) => (done(null, user)))
      .catch((ex) => (done(ex)));
  });

  app.use((req, res, next) => {
    // Save the redirectUrl on the session.
    // So, we can use it later when redirecting.
    if (req.query.appRedirectUrl) {
      req.session.appRedirectUrl = req.query.appRedirectUrl;
    }
    next();
  })

  initLoginStrategies(app, db, (req, res) => {
    res.cookie('userId', req.user._id, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // expires in a year
    })
    const appRedirectUrl = req.session.appRedirectUrl || '/logincheck';
    req.session.appRedirectUrl = null;
    res.redirect(appRedirectUrl);
  });

  app.get('/logout', (req, res) => {
    req.logout('/');
    res.cookie('userId', null, {
      expires: new Date(Date.now() - 1000),
    });

    const appRedirectUrl = req.query.appRedirectUrl || '/logincheck';
    res.redirect(appRedirectUrl);
  });

  // Client side app can use this to check the authentication.
  app.get('/logincheck', (req, res) => {
    if (req.user) {
      return res.json({loggedIn: true, userId: req.user._id});
    }

    return res.json({loggedIn: false});
  })
};

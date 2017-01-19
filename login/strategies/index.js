const github = require('./github')
const loginToken = require('./login-token')
const adminToken = require('./admin-token')

module.exports = function (app, db, onLoginSuccess) {
  github(app, db, onLoginSuccess)
  loginToken(app, db, onLoginSuccess)
  adminToken(app, db, onLoginSuccess)
}

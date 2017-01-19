const github = require('./github')
const token = require('./token')

module.exports = function (app, db, onLoginSuccess) {
  github(app, db, onLoginSuccess)
  token(app, db, onLoginSuccess)
}

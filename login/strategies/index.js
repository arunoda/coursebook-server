const github = require('./github')

module.exports = function (app, db, onLoginSuccess) {
  github(app, db, onLoginSuccess)
}

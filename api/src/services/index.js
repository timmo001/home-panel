const users = require('./users/users.service.js');
const config = require('./config/config.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(config);
};

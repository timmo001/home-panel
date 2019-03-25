// Initializes the `config` service on path `/config`
const createService = require('feathers-nedb');
const createModel = require('../../models/config.model');
const hooks = require('./config.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/config', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('config');

  service.hooks(hooks);
};

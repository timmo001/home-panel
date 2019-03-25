const { authenticate } = require('@feathersjs/authentication').hooks;

const populateUser = require('../../hooks/populate-user');

const processConfig = require('../../hooks/process-config');

const processConfigUpdate = require('../../hooks/process-config-update');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [processConfig()],
    update: [processConfigUpdate()],
    patch: [processConfigUpdate()],
    remove: []
  },

  after: {
    all: [populateUser()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

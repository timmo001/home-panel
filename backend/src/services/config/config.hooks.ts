import * as authentication from '@feathersjs/authentication';
import processConfig from '../../hooks/process-config';
import processConfigUpdate from '../../hooks/process-config-update';
import populateUser from '../../hooks/populate-user';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [processConfig()],
    update: [processConfigUpdate()],
    patch: [processConfigUpdate()],
    remove: [],
  },

  after: {
    all: [populateUser()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

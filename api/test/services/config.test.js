const assert = require('assert');
const app = require('../../src/app');

describe('\'config\' service', () => {
  it('registered the service', () => {
    const service = app.service('config');

    assert.ok(service, 'Registered the service');
  });
});

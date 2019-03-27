const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const processConfig = require('../../src/hooks/process-config');

describe('process-config hook', () => {
  let app;

  beforeEach(() => {
    // Create a new plain Feathers application
    app = feathers();

    // Register a dummy custom service that just return the
    // config data back
    app.use('/config', {
      async create(data) {
        return data;
      }
    });

    // Register the `processconfig` hook on that service
    app.service('config').hooks({
      before: {
        create: processConfig()
      }
    });
  });

  it('processes the config as expected', async () => {
    // A user stub with just an `_id`
    const user = { _id: 'test' };
    // The service method call `params`
    const params = { user };

    // Create a new config with params that contains our user
    const config = await app.service('config').create(
      {
        config: {}
      },
      params
    );

    assert.equal(config.text, 'Hi there');
    // `userId` was set
    assert.equal(config.userId, 'test');
    // `additional` property has been removed
    assert.ok(!config.additional);
  });
});

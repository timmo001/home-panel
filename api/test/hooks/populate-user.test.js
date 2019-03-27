const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const populateUser = require('../../src/hooks/populate-user');

describe('populate-user hook', () => {
  let app, user;

  beforeEach(async () => {
    // Database adapter pagination options
    const options = {
      paginate: {
        default: 10,
        max: 25
      }
    };

    app = feathers();

    // Register `users` and `messages` service in-memory
    app.use('/users', memory(options));
    app.use('/messages', memory(options));

    // Add the hook to the dummy service
    app.service('messages').hooks({
      after: populateUser()
    });

    // Create a new user we can use to test with
    user = await app.service('users').create({
      usename: 'test'
    });
  });

  it('populates a new message with the user', async () => {
    const message = await app.service('messages').create({
      text: 'A test message',
      // Set `userId` manually (usually done by `process-message` hook)
      userId: user.id
    });

    // Make sure that user got added to the returned message
    assert.deepEqual(message.user, user);
  });
});

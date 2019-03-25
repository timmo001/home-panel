// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks, see: http://docs.feathersjs.com/api/hooks.html

module.exports = function(_options = {}) {
  // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    let { app, method, result, params } = context;

    // The authenticated user
    const userId = params.user._id;

    // Make sure that we always have a list of messages either by wrapping
    // a single message into an array or by getting the `data` from the `find` method's result
    let notes = method === 'find' ? result.data : [result];

    // Asynchronously get user object from each message's `userId`
    // and add it to the message
    await Promise.all(
      notes.map(async note => {
        // Also pass the original `params` to the service call
        // so that it has the same information available (e.g. who is requesting it)
        note.user = await app.service('users').get(note.userId, params);
      })
    );

    notes = notes.filter(n => n.userId === userId);

    if (method === 'find') result.data = notes;
    else result = result.userId === userId ? result : null;

    // Best practice: hooks should always return the context
    return context;
  };
};

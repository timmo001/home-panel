// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, params } = context;
    let { result } = context;

    // The authenticated user
    const userId = params.user._id;

    // Make sure that we always have a list of messages either by wrapping
    // a single message into an array or by getting the `data` from the `find` method's result
    let config = method === 'find' ? result.data : [result];

    // Asynchronously get user object from each message's `userId`
    // and add it to the message
    await Promise.all(
      config.map(async (config: any) => {
        // Also pass the original `params` to the service call
        // so that it has the same information available (e.g. who is requesting it)
        config.user = await app.service('users').get(config.userId, params);
      })
    );

    config = config.filter((config: any) => config.userId === userId);

    if (method === 'find') result.data = config;
    else result = result.userId === userId ? result : null;

    // Best practice: hooks should always return the context
    return context;
  };
};

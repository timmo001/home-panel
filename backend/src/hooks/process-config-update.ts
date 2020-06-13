// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (_options = {}): Hook => {
  return async (context: HookContext) => {
    const { data } = context;
    const { config, createdAt } = data;

    // Throw an error if there isn't any config
    if (!config) throw new Error('config is required');

    // The authenticated user
    const user = context.params.user;

    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      config,
      // Set the user id
      userId: user._id,
      createdAt,
      // Add the current date
      updatedAt: new Date().getTime(),
    };

    // Best practice: hooks should always return the context
    return context;
  };
};

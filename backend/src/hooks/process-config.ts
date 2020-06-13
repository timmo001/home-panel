// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { data } = context;
    let { config } = data;
    const { createNew } = data;

    if (createNew) {
      config = JSON.parse(
        require('fs').readFileSync('config/config.default.json')
      );
      // Throw an error if there isn't any default config
      if (!config)
        throw new Error(
          'No default config was found. This should be located in "api/config/config.default.json"'
        );
    }

    // Throw an error if there isn't any config
    if (!config) throw new Error('Config is required');

    // The authenticated user
    const user = context.params.user;

    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      config,
      // Set the user id
      userId: user._id,
      // Add the current date
      createdAt: new Date().getTime(),
    };

    // Best practice: hooks should always return the context
    return context;
  };
};

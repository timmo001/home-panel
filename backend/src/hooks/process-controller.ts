// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (_options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, data, params } = context;
    let { page, card } = data;
    const { command } = data;

    if (!page && !card) throw new Error('page or card is required');
    if (page && typeof page !== 'string')
      throw new Error('page should be of the type string');
    if (card && typeof card !== 'string')
      throw new Error('card should be of the type string');
    if (!command) throw new Error('command is required');

    if (command !== 'show' && command !== 'expand' && command !== 'unexpand')
      throw new Error('command should be show, expand or unexpand');

    const getter = await app.service('config').find(params);
    if (!getter && !getter.data[0])
      throw new Error('Could not find config for user');

    const config = getter.data[0].config;

    if (page) {
      const foundPage = await config.pages.find(
        (item: { key: string; name: string }) =>
          item.key === page || item.name === page
      );
      if (!foundPage) throw new Error('Could not find page');
      page = foundPage.key;
    }

    if (card) {
      const foundCard = await config.cards.find(
        (item: { key: string; title: string }) =>
          item.key === card || item.title === card
      );
      if (!foundCard) throw new Error('Could not find card');
      card = foundCard.key;
    }

    context.data = {
      ...data,
      page,
      card,
    };

    // Best practice: hooks should always return the context
    return context;
  };
};

// Initializes the `controller` service on path `/controller`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Controller } from './controller.class';
import hooks from './controller.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    controller: Controller & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/controller', new Controller(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('controller');

  service.hooks(hooks);
}

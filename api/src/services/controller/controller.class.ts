import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods
} from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface Data {}

interface ServiceOptions {}

export class Controller implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id,
      text: `A new message with ID: ${id}!`
    };
  }

  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}

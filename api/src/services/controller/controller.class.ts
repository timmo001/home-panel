import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers';
import { Application } from '../../declarations';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Data {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions {}

export class Controller implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find(_params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get(id: Id, _params?: Params): Promise<Data> {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(_id: NullableId, data: Data, _params?: Params): Promise<Data> {
    return data;
  }

  async patch(_id: NullableId, data: Data, _params?: Params): Promise<Data> {
    return data;
  }

  async remove(id: NullableId, _params?: Params): Promise<Data> {
    return { id };
  }
}

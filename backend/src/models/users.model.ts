import NeDB from 'nedb';
import path from 'path';
import { Application } from '../declarations';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (app: Application) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'users.db'),
    autoload: true,
  });

  Model.ensureIndex({ fieldName: 'username', unique: true });

  return Model;
}

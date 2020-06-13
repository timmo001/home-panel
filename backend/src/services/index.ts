import { Application } from '../declarations';
import users from './users/users.service';
import config from './config/config.service';
import controller from './controller/controller.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(config);
  app.configure(controller);
}

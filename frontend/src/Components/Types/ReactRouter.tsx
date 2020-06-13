import { RouteComponentProps } from 'react-router';
import { History, Location } from 'history';

type Params = {
  configuration: string;
  edit: string;
  overview: string;
};

type LocationExtended = Location<any>;

export interface RouteComponentExtendedProps
  extends RouteComponentProps<Params> {
  location: LocationExtended;
  history: History<any>;
}

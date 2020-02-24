import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';

type LocationStateExtended =
  | {
      configuration: string;
      edit: string;
      overview: string;
    }
  | null
  | undefined;

interface LocationExtended extends H.Location<H.LocationState> {
  state: LocationStateExtended;
}

export interface RouteComponentExtendedProps extends RouteComponentProps {
  location: LocationExtended;
}

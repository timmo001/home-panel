import { HassEntity } from 'home-assistant-js-websocket';
import { supportsFeature } from './supportsFeature';

// Expects classNames to be an object mapping feature-bit -> className
export default function featureClassNames(
  stateObj: HassEntity,
  classNames: { [feature: number]: string }
) {
  if (!stateObj || !stateObj.attributes.supported_features) {
    return '';
  }

  return Object.keys(classNames)
    .map((feature: any) =>
      supportsFeature(stateObj, Number(feature)) ? classNames[feature] : ''
    )
    .filter(attr => attr !== '')
    .join(' ');
}

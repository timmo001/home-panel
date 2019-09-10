// @flow
import { HassEntity } from 'home-assistant-js-websocket';
import { supportsFeature } from './supportsFeature';

// Expects classNames to be an object mapping feature-bit -> className
export default function featureClassNames(
  entity: HassEntity | undefined,
  classNames: { [feature: number]: string }
) {
  if (!entity || !entity.attributes.supported_features) {
    return [];
  }

  return Object.keys(classNames)
    .map((feature: any) =>
      supportsFeature(entity, Number(feature)) ? classNames[feature] : ''
    )
    .filter(attr => attr !== '');
}

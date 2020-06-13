import { HassEntity } from 'home-assistant-js-websocket';
import { supportsFeature } from './SupportsFeature';

// Expects classNames to be an object mapping feature-bit -> className
export default function featureClassNames(
  entity: HassEntity | undefined,
  classNames: { [feature: number]: string }
): string[] {
  if (!entity || !entity.attributes.supported_features) {
    return [];
  }

  return Object.keys(classNames)
    .map((feature: string) =>
      supportsFeature(entity, Number(feature))
        ? classNames[Number(feature)]
        : ''
    )
    .filter((attr) => attr !== '');
}

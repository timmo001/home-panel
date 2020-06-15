import { HassEntity } from 'home-assistant-js-websocket';

export const supportsFeature = (
  stateObj: HassEntity,
  feature: number
): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (stateObj.attributes.supported_features! & feature) !== 0;
};

import {
  HassEntityAttributeBase,
  HassEntityBase,
} from "home-assistant-js-websocket";

import { UNAVAILABLE, entitySupportsFeature } from "@/utils/homeAssistant";

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/data/cover.ts
export const enum CoverEntityFeature {
  OPEN = 1,
  CLOSE = 2,
  SET_POSITION = 4,
  STOP = 8,
  OPEN_TILT = 16,
  CLOSE_TILT = 32,
  STOP_TILT = 64,
  SET_TILT_POSITION = 128,
}

export function isFullyOpen(stateObj: CoverEntity) {
  if (stateObj.attributes.current_position !== undefined) {
    return stateObj.attributes.current_position === 100;
  }
  return stateObj.state === "open";
}

export function isFullyClosed(stateObj: CoverEntity) {
  if (stateObj.attributes.current_position !== undefined) {
    return stateObj.attributes.current_position === 0;
  }
  return stateObj.state === "closed";
}

export function isFullyOpenTilt(stateObj: CoverEntity) {
  return stateObj.attributes.current_tilt_position === 100;
}

export function isFullyClosedTilt(stateObj: CoverEntity) {
  return stateObj.attributes.current_tilt_position === 0;
}

export function isOpening(stateObj: CoverEntity) {
  return stateObj.state === "opening";
}

export function isClosing(stateObj: CoverEntity) {
  return stateObj.state === "closing";
}

export function isTiltOnly(stateObj: CoverEntity) {
  const supportsCover =
    entitySupportsFeature(stateObj, CoverEntityFeature.OPEN) ||
    entitySupportsFeature(stateObj, CoverEntityFeature.CLOSE) ||
    entitySupportsFeature(stateObj, CoverEntityFeature.STOP);
  const supportsTilt =
    entitySupportsFeature(stateObj, CoverEntityFeature.OPEN_TILT) ||
    entitySupportsFeature(stateObj, CoverEntityFeature.CLOSE_TILT) ||
    entitySupportsFeature(stateObj, CoverEntityFeature.STOP_TILT);
  return supportsTilt && !supportsCover;
}

export function canOpen(stateObj: CoverEntity) {
  if (stateObj.state === UNAVAILABLE) {
    return false;
  }
  const assumedState = stateObj.attributes.assumed_state === true;
  return (!isFullyOpen(stateObj) && !isOpening(stateObj)) || assumedState;
}

export function canClose(stateObj: CoverEntity): boolean {
  if (stateObj.state === UNAVAILABLE) {
    return false;
  }
  const assumedState = stateObj.attributes.assumed_state === true;
  return (!isFullyClosed(stateObj) && !isClosing(stateObj)) || assumedState;
}

export function canStop(stateObj: CoverEntity): boolean {
  return stateObj.state !== UNAVAILABLE;
}

export function canOpenTilt(stateObj: CoverEntity): boolean {
  if (stateObj.state === UNAVAILABLE) {
    return false;
  }
  const assumedState = stateObj.attributes.assumed_state === true;
  return !isFullyOpenTilt(stateObj) || assumedState;
}

export function canCloseTilt(stateObj: CoverEntity): boolean {
  if (stateObj.state === UNAVAILABLE) {
    return false;
  }
  const assumedState = stateObj.attributes.assumed_state === true;
  return !isFullyClosedTilt(stateObj) || assumedState;
}

export function canStopTilt(stateObj: CoverEntity): boolean {
  return stateObj.state !== UNAVAILABLE;
}

interface CoverEntityAttributes extends HassEntityAttributeBase {
  current_position?: number;
  current_tilt_position?: number;
}

export interface CoverEntity extends HassEntityBase {
  attributes: CoverEntityAttributes;
}

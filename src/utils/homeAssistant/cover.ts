// Sourced from https://github.com/home-assistant/frontend/blob/cc61131e4beef8e6a76c8242557d29387b2a91a2/src/data/cover.ts#L11
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

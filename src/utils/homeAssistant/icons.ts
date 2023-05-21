import {
  mdiAccount,
  mdiAccountArrowRight,
  mdiAirHumidifier,
  mdiAirHumidifierOff,
  mdiAlertCircle,
  mdiAlertCircleOutline,
  mdiArrowCollapseHorizontal,
  mdiArrowDown,
  mdiArrowDownBox,
  mdiArrowExpandHorizontal,
  mdiArrowSplitVertical,
  mdiArrowUp,
  mdiArrowUpBox,
  mdiAudioVideo,
  mdiAudioVideoOff,
  mdiBattery,
  mdiBattery10,
  mdiBattery20,
  mdiBattery30,
  mdiBattery40,
  mdiBattery50,
  mdiBattery60,
  mdiBattery70,
  mdiBattery80,
  mdiBattery90,
  mdiBatteryAlert,
  mdiBatteryAlertVariantOutline,
  mdiBatteryCharging,
  mdiBatteryCharging10,
  mdiBatteryCharging20,
  mdiBatteryCharging30,
  mdiBatteryCharging40,
  mdiBatteryCharging50,
  mdiBatteryCharging60,
  mdiBatteryCharging70,
  mdiBatteryCharging80,
  mdiBatteryCharging90,
  mdiBatteryChargingOutline,
  mdiBatteryOutline,
  mdiBatteryUnknown,
  mdiBellRing,
  mdiBlindsHorizontal,
  mdiBlindsHorizontalClosed,
  mdiBluetooth,
  mdiBluetoothConnect,
  mdiBrightness5,
  mdiBrightness7,
  mdiCalendar,
  mdiCast,
  mdiCastConnected,
  mdiCastOff,
  mdiChartSankey,
  mdiCheckCircle,
  mdiCheckCircleOutline,
  mdiCheckNetworkOutline,
  mdiCheckboxMarkedCircle,
  mdiCircle,
  mdiCircleSlice8,
  mdiClock,
  mdiCloseCircleOutline,
  mdiCloseNetworkOutline,
  mdiCropPortrait,
  mdiCurtains,
  mdiCurtainsClosed,
  mdiDoorClosed,
  mdiDoorOpen,
  mdiFan,
  mdiFanOff,
  mdiFire,
  mdiGarage,
  mdiGarageOpen,
  mdiGate,
  mdiGateArrowRight,
  mdiGateOpen,
  mdiGestureTapButton,
  mdiHome,
  mdiHomeOutline,
  mdiLanConnect,
  mdiLanDisconnect,
  mdiLock,
  mdiLockAlert,
  mdiLockClock,
  mdiLockOpen,
  mdiMotionSensor,
  mdiMotionSensorOff,
  mdiMusicNote,
  mdiMusicNoteOff,
  mdiPackage,
  mdiPackageDown,
  mdiPackageUp,
  mdiPlay,
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiRadioboxBlank,
  mdiRestart,
  mdiRobot,
  mdiRobotOff,
  mdiRollerShade,
  mdiRollerShadeClosed,
  mdiSecurity,
  mdiShield,
  mdiShieldAirplane,
  mdiShieldHome,
  mdiShieldLock,
  mdiShieldMoon,
  mdiShieldOff,
  mdiShieldOutline,
  mdiSmokeDetector,
  mdiSmokeDetectorAlert,
  mdiSmokeDetectorVariant,
  mdiSmokeDetectorVariantAlert,
  mdiSnowflake,
  mdiSpeaker,
  mdiSpeakerOff,
  mdiSpeakerPause,
  mdiSpeakerPlay,
  mdiSquare,
  mdiSquareOutline,
  mdiStop,
  mdiSwapHorizontal,
  mdiTelevision,
  mdiTelevisionOff,
  mdiTelevisionPause,
  mdiTelevisionPlay,
  mdiThermometer,
  mdiToggleSwitchVariant,
  mdiToggleSwitchVariantOff,
  mdiVibrate,
  mdiVideo,
  mdiVideoOff,
  mdiWater,
  mdiWaterBoiler,
  mdiWaterBoilerOff,
  mdiWaterOff,
  mdiWeatherCloudy,
  mdiWeatherFog,
  mdiWeatherHail,
  mdiWeatherLightning,
  mdiWeatherLightningRainy,
  mdiWeatherNight,
  mdiWeatherNightPartlyCloudy,
  mdiWeatherPartlyCloudy,
  mdiWeatherPouring,
  mdiWeatherRainy,
  mdiWeatherSnowy,
  mdiWeatherSnowyRainy,
  mdiWeatherSunny,
  mdiWeatherWindy,
  mdiWeatherWindyVariant,
  mdiWhiteBalanceSunny,
  mdiWindowClosed,
  mdiWindowOpen,
  mdiWindowShutter,
  mdiWindowShutterOpen,
} from "@mdi/js";
import { HassEntity } from "home-assistant-js-websocket";

import {
  DEFAULT_DOMAIN_ICON,
  FIXED_DEVICE_CLASS_ICONS,
  FIXED_DOMAIN_ICONS,
  UNIT_C,
  UNIT_F,
} from "@/utils/homeAssistant/const";

// Sourced from https://github.com/home-assistant/frontend/blob/cc61131e4beef8e6a76c8242557d29387b2a91a2/src/common/entity/domain_icon.ts#LL68C1-L265C3
export const domainIcon = (
  domain: string,
  stateObj?: HassEntity,
  state?: string
): string => {
  const icon = domainIconWithoutDefault(domain, stateObj, state);
  if (icon) {
    return icon;
  }
  console.warn("Unable to find icon for domain:", domain);
  return DEFAULT_DOMAIN_ICON;
};

export const domainIconWithoutDefault = (
  domain: string,
  stateObj?: HassEntity,
  state?: string
): string | undefined => {
  const compareState = state !== undefined ? state : stateObj?.state;

  switch (domain) {
    case "alarm_control_panel":
      return alarmPanelIcon(compareState);

    case "automation":
      return compareState === "off" ? mdiRobotOff : mdiRobot;

    case "binary_sensor":
      return binarySensorIcon(compareState, stateObj);

    case "button":
      switch (stateObj?.attributes.device_class) {
        case "restart":
          return mdiRestart;
        case "update":
          return mdiPackageUp;
        default:
          return mdiGestureTapButton;
      }

    case "camera":
      return compareState === "off" ? mdiVideoOff : mdiVideo;

    case "cover":
      return coverIcon(compareState, stateObj);

    case "device_tracker":
      if (stateObj?.attributes.source_type === "router") {
        return compareState === "home" ? mdiLanConnect : mdiLanDisconnect;
      }
      if (
        ["bluetooth", "bluetooth_le"].includes(stateObj?.attributes.source_type)
      ) {
        return compareState === "home" ? mdiBluetoothConnect : mdiBluetooth;
      }
      return compareState === "not_home" ? mdiAccountArrowRight : mdiAccount;

    case "fan":
      return compareState === "off" ? mdiFanOff : mdiFan;

    case "humidifier":
      return compareState === "off" ? mdiAirHumidifierOff : mdiAirHumidifier;

    case "input_boolean":
      return compareState === "on"
        ? mdiCheckCircleOutline
        : mdiCloseCircleOutline;

    case "input_datetime":
      if (!stateObj?.attributes.has_date) {
        return mdiClock;
      }
      if (!stateObj.attributes.has_time) {
        return mdiCalendar;
      }
      break;

    case "lock":
      switch (compareState) {
        case "unlocked":
          return mdiLockOpen;
        case "jammed":
          return mdiLockAlert;
        case "locking":
        case "unlocking":
          return mdiLockClock;
        default:
          return mdiLock;
      }

    case "media_player":
      switch (stateObj?.attributes.device_class) {
        case "speaker":
          switch (compareState) {
            case "playing":
              return mdiSpeakerPlay;
            case "paused":
              return mdiSpeakerPause;
            case "off":
              return mdiSpeakerOff;
            default:
              return mdiSpeaker;
          }
        case "tv":
          switch (compareState) {
            case "playing":
              return mdiTelevisionPlay;
            case "paused":
              return mdiTelevisionPause;
            case "off":
              return mdiTelevisionOff;
            default:
              return mdiTelevision;
          }
        case "receiver":
          switch (compareState) {
            case "off":
              return mdiAudioVideoOff;
            default:
              return mdiAudioVideo;
          }
        default:
          switch (compareState) {
            case "playing":
            case "paused":
              return mdiCastConnected;
            case "off":
              return mdiCastOff;
            default:
              return mdiCast;
          }
      }

    case "number": {
      const icon = numberIcon(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case "person":
      return compareState === "not_home" ? mdiAccountArrowRight : mdiAccount;

    case "switch":
      switch (stateObj?.attributes.device_class) {
        case "outlet":
          return compareState === "on" ? mdiPowerPlug : mdiPowerPlugOff;
        case "switch":
          return compareState === "on"
            ? mdiToggleSwitchVariant
            : mdiToggleSwitchVariantOff;
        default:
          return mdiToggleSwitchVariant;
      }

    case "sensor": {
      const icon = sensorIcon(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case "sun":
      return stateObj?.state === "above_horizon"
        ? mdiWhiteBalanceSunny
        : mdiWeatherNight;

    case "switch_as_x":
      return mdiSwapHorizontal;

    case "threshold":
      return mdiChartSankey;

    case "update":
      return compareState === "on" ? mdiPackageDown : mdiPackage;

    case "water_heater":
      return compareState === "off" ? mdiWaterBoilerOff : mdiWaterBoiler;

    case "weather":
      return weatherIcon(stateObj?.state);
  }

  if (domain in FIXED_DOMAIN_ICONS) {
    return FIXED_DOMAIN_ICONS[domain as keyof typeof FIXED_DOMAIN_ICONS];
  }

  return undefined;
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/alarm_panel_icon.ts
export const alarmPanelIcon = (state?: string) => {
  switch (state) {
    case "armed_away":
      return mdiShieldLock;
    case "armed_vacation":
      return mdiShieldAirplane;
    case "armed_home":
      return mdiShieldHome;
    case "armed_night":
      return mdiShieldMoon;
    case "armed_custom_bypass":
      return mdiSecurity;
    case "pending":
      return mdiShieldOutline;
    case "triggered":
      return mdiBellRing;
    case "disarmed":
      return mdiShieldOff;
    default:
      return mdiShield;
  }
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/binary_sensor_icon.ts
export const binarySensorIcon = (state?: string, stateObj?: HassEntity) => {
  const is_off = state === "off";
  switch (stateObj?.attributes.device_class) {
    case "battery":
      return is_off ? mdiBattery : mdiBatteryOutline;
    case "battery_charging":
      return is_off ? mdiBattery : mdiBatteryCharging;
    case "carbon_monoxide":
      return is_off ? mdiSmokeDetector : mdiSmokeDetectorAlert;
    case "cold":
      return is_off ? mdiThermometer : mdiSnowflake;
    case "connectivity":
      return is_off ? mdiCloseNetworkOutline : mdiCheckNetworkOutline;
    case "door":
      return is_off ? mdiDoorClosed : mdiDoorOpen;
    case "garage_door":
      return is_off ? mdiGarage : mdiGarageOpen;
    case "power":
      return is_off ? mdiPowerPlugOff : mdiPowerPlug;
    case "gas":
    case "problem":
    case "safety":
    case "tamper":
      return is_off ? mdiCheckCircle : mdiAlertCircle;
    case "smoke":
      return is_off ? mdiSmokeDetectorVariant : mdiSmokeDetectorVariantAlert;
    case "heat":
      return is_off ? mdiThermometer : mdiFire;
    case "light":
      return is_off ? mdiBrightness5 : mdiBrightness7;
    case "lock":
      return is_off ? mdiLock : mdiLockOpen;
    case "moisture":
      return is_off ? mdiWaterOff : mdiWater;
    case "motion":
      return is_off ? mdiMotionSensorOff : mdiMotionSensor;
    case "occupancy":
      return is_off ? mdiHomeOutline : mdiHome;
    case "opening":
      return is_off ? mdiSquare : mdiSquareOutline;
    case "plug":
      return is_off ? mdiPowerPlugOff : mdiPowerPlug;
    case "presence":
      return is_off ? mdiHomeOutline : mdiHome;
    case "running":
      return is_off ? mdiStop : mdiPlay;
    case "sound":
      return is_off ? mdiMusicNoteOff : mdiMusicNote;
    case "update":
      return is_off ? mdiPackage : mdiPackageUp;
    case "vibration":
      return is_off ? mdiCropPortrait : mdiVibrate;
    case "window":
      return is_off ? mdiWindowClosed : mdiWindowOpen;
    default:
      return is_off ? mdiRadioboxBlank : mdiCheckboxMarkedCircle;
  }
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/cover_icon.ts
export const coverIcon = (state?: string, stateObj?: HassEntity): string => {
  const open = state !== "closed";

  switch (stateObj?.attributes.device_class) {
    case "garage":
      switch (state) {
        case "opening":
          return mdiArrowUpBox;
        case "closing":
          return mdiArrowDownBox;
        case "closed":
          return mdiGarage;
        default:
          return mdiGarageOpen;
      }
    case "gate":
      switch (state) {
        case "opening":
        case "closing":
          return mdiGateArrowRight;
        case "closed":
          return mdiGate;
        default:
          return mdiGateOpen;
      }
    case "door":
      return open ? mdiDoorOpen : mdiDoorClosed;
    case "damper":
      return open ? mdiCircle : mdiCircleSlice8;
    case "shutter":
      switch (state) {
        case "opening":
          return mdiArrowUpBox;
        case "closing":
          return mdiArrowDownBox;
        case "closed":
          return mdiWindowShutter;
        default:
          return mdiWindowShutterOpen;
      }
    case "curtain":
      switch (state) {
        case "opening":
          return mdiArrowSplitVertical;
        case "closing":
          return mdiArrowCollapseHorizontal;
        case "closed":
          return mdiCurtainsClosed;
        default:
          return mdiCurtains;
      }
    case "blind":
      switch (state) {
        case "opening":
          return mdiArrowUpBox;
        case "closing":
          return mdiArrowDownBox;
        case "closed":
          return mdiBlindsHorizontalClosed;
        default:
          return mdiBlindsHorizontal;
      }
    case "shade":
      switch (state) {
        case "opening":
          return mdiArrowUpBox;
        case "closing":
          return mdiArrowDownBox;
        case "closed":
          return mdiRollerShadeClosed;
        default:
          return mdiRollerShade;
      }
    case "window":
      switch (state) {
        case "opening":
          return mdiArrowUpBox;
        case "closing":
          return mdiArrowDownBox;
        case "closed":
          return mdiWindowClosed;
        default:
          return mdiWindowOpen;
      }
  }

  switch (state) {
    case "opening":
      return mdiArrowUpBox;
    case "closing":
      return mdiArrowDownBox;
    case "closed":
      return mdiWindowClosed;
    default:
      return mdiWindowOpen;
  }
};

export const computeOpenIcon = (stateObj: HassEntity): string => {
  switch (stateObj.attributes.device_class) {
    case "awning":
    case "door":
    case "gate":
    case "curtain":
      return mdiArrowExpandHorizontal;
    default:
      return mdiArrowUp;
  }
};

export const computeCloseIcon = (stateObj: HassEntity): string => {
  switch (stateObj.attributes.device_class) {
    case "awning":
    case "door":
    case "gate":
    case "curtain":
      return mdiArrowCollapseHorizontal;
    default:
      return mdiArrowDown;
  }
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/number_icon.ts
export const numberIcon = (stateObj?: HassEntity): string | undefined => {
  const dclass = stateObj?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS) {
    return FIXED_DEVICE_CLASS_ICONS[
      dclass as keyof typeof FIXED_DEVICE_CLASS_ICONS
    ];
  }

  return undefined;
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/sensor_icon.ts
export const sensorIcon = (stateObj?: HassEntity): string | undefined => {
  const dclass = stateObj?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS) {
    return FIXED_DEVICE_CLASS_ICONS[
      dclass as keyof typeof FIXED_DEVICE_CLASS_ICONS
    ];
  }

  if (dclass === "battery") {
    return stateObj ? batteryStateIcon(stateObj) : mdiBattery;
  }

  const unit = stateObj?.attributes.unit_of_measurement;
  if (unit === UNIT_C || unit === UNIT_F) {
    return mdiThermometer;
  }

  return undefined;
};

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/common/entity/battery_icon.ts
const BATTERY_ICONS = {
  10: mdiBattery10,
  20: mdiBattery20,
  30: mdiBattery30,
  40: mdiBattery40,
  50: mdiBattery50,
  60: mdiBattery60,
  70: mdiBattery70,
  80: mdiBattery80,
  90: mdiBattery90,
  100: mdiBattery,
};

const BATTERY_CHARGING_ICONS = {
  10: mdiBatteryCharging10,
  20: mdiBatteryCharging20,
  30: mdiBatteryCharging30,
  40: mdiBatteryCharging40,
  50: mdiBatteryCharging50,
  60: mdiBatteryCharging60,
  70: mdiBatteryCharging70,
  80: mdiBatteryCharging80,
  90: mdiBatteryCharging90,
  100: mdiBatteryCharging,
};

export const batteryStateIcon = (
  batteryState: HassEntity,
  batteryChargingState?: HassEntity
) => {
  const battery = batteryState.state;
  const batteryCharging =
    batteryChargingState && batteryChargingState.state === "on";

  return batteryIcon(battery, batteryCharging);
};

export const batteryIcon = (
  batteryState: number | string,
  batteryCharging?: boolean
) => {
  const batteryValue = Number(batteryState);
  if (isNaN(batteryValue)) {
    if (batteryState === "off") {
      return mdiBattery;
    }
    if (batteryState === "on") {
      return mdiBatteryAlert;
    }
    return mdiBatteryUnknown;
  }

  const batteryRound = Math.round(batteryValue / 10) * 10;
  if (batteryCharging && batteryValue >= 10) {
    return BATTERY_CHARGING_ICONS[batteryRound as keyof typeof BATTERY_ICONS];
  }
  if (batteryCharging) {
    return mdiBatteryChargingOutline;
  }
  if (batteryValue <= 5) {
    return mdiBatteryAlertVariantOutline;
  }
  return BATTERY_ICONS[batteryRound as keyof typeof BATTERY_ICONS];
};

export const weatherIcon = (
  state?: string,
  nightTime?: boolean
): string | undefined =>
  !state
    ? undefined
    : nightTime && state === "partlycloudy"
    ? mdiWeatherNightPartlyCloudy
    : weatherIcons[state as keyof typeof weatherIcons];

// Sourced from https://github.com/home-assistant/frontend/blob/dev/src/data/weather.ts#L81
export const weatherIcons = {
  "clear-night": mdiWeatherNight,
  cloudy: mdiWeatherCloudy,
  exceptional: mdiAlertCircleOutline,
  fog: mdiWeatherFog,
  hail: mdiWeatherHail,
  lightning: mdiWeatherLightning,
  "lightning-rainy": mdiWeatherLightningRainy,
  partlycloudy: mdiWeatherPartlyCloudy,
  pouring: mdiWeatherPouring,
  rainy: mdiWeatherRainy,
  snowy: mdiWeatherSnowy,
  "snowy-rainy": mdiWeatherSnowyRainy,
  sunny: mdiWeatherSunny,
  windy: mdiWeatherWindy,
  "windy-variant": mdiWeatherWindyVariant,
};

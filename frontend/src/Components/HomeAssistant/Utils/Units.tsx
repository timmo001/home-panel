import { HassConfig } from "home-assistant-js-websocket";

export const weatherMap: { [item: string]: string } = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant",
};

export const weatherNameMap: { [item: string]: string } = {
  "clear-night": "Clear",
  cloudy: "Cloudy",
  fog: "Fog",
  hail: "Hail",
  lightning: "Lightning",
  "lightning-rainy": "Lightning & Rain",
  partlycloudy: "Partly Cloudy",
  pouring: "Rain",
  rainy: "Rain",
  snowy: "Snow",
  "snowy-rainy": "Snow & Rain",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy",
};

export function getUnit(
  measure: string,
  hassConfig?: HassConfig
): string | null {
  if (hassConfig) {
    const lengthUnit = hassConfig.unit_system.length || "";
    switch (measure) {
      case "length":
      case "mass":
      case "volume":
      case "temperature":
        return hassConfig.unit_system[measure];
      case "pressure":
        return lengthUnit === "km" ? " hPa" : " inHg";
      case "precipitation":
        return lengthUnit === "km" ? " mm" : " in";
      case "wind_speed":
        return lengthUnit === "km" ? " km/h" : " mph";
      case "wind_bearing":
        return "°";
      case "humidity":
        return "%";
      default:
        return "";
    }
  } else return null;
}

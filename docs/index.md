# Home Panel

[![pipeline status](https://gitlab.com/timmo/home-panel/badges/master/pipeline.svg)](https://gitlab.com/timmo/home-panel/commits/master)

A touch-compatible web-app for controlling the home.

## Setup

- Lorem Ipsum
- Lorem Ipsum
- Lorem Ipsum
- Lorem Ipsum

## Starter Template

```json
{
  "home_assistant": {
    "host": "hassio.local:8123",
    "password": "password",
    "ssl": true
  },
  "theme": {},
  "weather": {
    "outdoor": {
      "dark_sky_icon": "sensor.dark_sky_icon",
      "condition": "sensor.pws_weather",
      "temperature": "sensor.pws_temp_c",
      "humidity": "sensor.pws_relative_humidity"
    },
    "indoor": {
      "label": "Living Room",
      "temperature": "sensor.dht22001_temperature",
      "humidity": "sensor.dht22001_humidity"
    }
  },
  "items": [
    {
      "name": "Living Room",
      "cards": [
        {
          "entity_id": "light.tv_light"
        }
      ]
    },
    {
      "name": "Dining Room",
      "cards": [
        {
          "entity_id": "light.table_light"
        }
      ]
    }
  ]
}
```
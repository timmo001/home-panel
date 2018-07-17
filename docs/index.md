# Home Panel

[![GitHub Release](https://img.shields.io/github/release/timmo001/home-panel.svg)](https://github.com/timmo001/home-panel/releases)
[![License](https://img.shields.io/github/license/timmo001/home-panel.svg)](LICENSE.md)
[![pipeline status](https://gitlab.com/timmo/home-panel/badges/master/pipeline.svg)](https://gitlab.com/timmo/home-panel/commits/master)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/timmo001/home-panel.svg?columns=To%20Do,On%20Hold,In%20Progress,Done)](https://waffle.io/timmo001/home-panel)

A touch-compatible web-app for controlling the home.

![Light Theme Screenshot][light-theme]

![Dark Theme Screenshot][dark-theme]

![More Info Screenshot][more-info]

---

## Features

- Supports and can be used as alternate frontend for [Home Assistant](https://www.home-assistant.io/)
- Supports MJPEG and related image-based camera/image feeds
- Add weather and weather icons using Home Assistant's
 [Dark Sky](https://www.home-assistant.io/components/weather.darksky/) component
- Made for touch screens with a sideways scrolling Material
 Design interface. (Compatible with deskops also)

---

## Setup

### Docker

- TBD

### Node JS

- Clone this repository
- Checkout the version you want via releases
- Rename `config.template.json` to `config.json`

  ```cp config.template.json src/config.json```

- Update `src/config.json` to your configuration. (See below)

- Install packages

  ```yarn install```

- Copy `config.json` into `node_modules/config.json`

```cp config.json node_modules```

- Build a production version

  ```yarn build```

#### Production - Quick and easy

> **This option is not secure. Do not open to the outside world!**

- Install serve

  ```sudo yarn global add serve```

- Serve the site

  ```serve -s build```

- Open the app in your browser at `http://localhost:5000`

#### Production - Secure

- TBD

#### Development

> **This option is not secure. Do not open to the outside world!**

- Run the app

  ```yarn start```

- The app should open in your default browser under `http://localhost:3000`

---

## Starter Template

```json

{
  "theme": {},
  "header": {
    "left_outdoor_weather": {
      "dark_sky_icon": "sensor.dark_sky_icon",
      "condition": "sensor.pws_weather",
      "data": [
        {
          "entity_id": "sensor.pws_temp_c",
          "unit_of_measurement": "°C"
        },
        {
          "entity_id": "sensor.pws_relative_humidity",
          "unit_of_measurement": "%"
        }
      ]
    },
    "right_indoor": [
      {
        "label": "Living Room",
        "data": [
          {
            "entity_id": "sensor.dht22_01_temperature",
            "unit_of_measurement": "°C"
          },
          {
            "entity_id": "sensor.dht22_01_humidity",
            "unit_of_measurement": "%"
          }
        ]
      }
    ]
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

[light-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/light-theme.png
[dark-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/dark-theme.png
[more-info]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info.png

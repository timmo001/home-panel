# Configuration

To get started, copy the [starter template][template]
 to the `files/config.json` file in the API.

Whenever you make a change, just reload the page and the latest `config.json`
 file will be used.

Now, we will go over the sections you can configure inside the JSON file along
 with examples you can adapt:

## theme

### auto

You can override the way the `auto` theme triggers between light and dark
 mode. The format is similar to the way [Home Assistant's][hass]
 automations work.
 You set the sensor's `entity_id` and the **below** threshold.

The sensor below is an LDR sensor which sets the *dark* theme when below
*600 LUX*:

```json
  "theme": {
    "auto": {
      "sensor": "sensor.sn1_ldr",
      "below": 600
    }
  },
```

### ui

This section is for general theme and layout customizations.

#### cards

```json
  "theme": {
    "ui": {
      "cards": {
        "round": true,
        "elevation": 2
      }
    }
  }
```

##### round

Should the card be round? Default is `false`.

```json
  "theme": {
    "ui": {
      "cards": {
        "round": true
      }
    }
  }
```

##### elevation

The elevation of the card. Default is `1`.

```json
  "theme": {
    "ui": {
      "cards": {
        "elevation": 2
      }
    }
  }
```

### custom

You can create custom themes in an array here. See the the docs [here][themes].

## header

This section can display weather and other sensor information in the top
 section of the app alongside the time and date.

![Header Screenshot][header]

```json
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
      },
      {
        "label": "Upstairs",
        "data": [
          {
            "entity_id": "sensor.sn2_temperature",
            "unit_of_measurement": "°C"
          },
          {
            "entity_id": "sensor.sn2_humidity",
            "unit_of_measurement": "%"
          }
        ]
      }
    ]
  },
```

### format

```json
  "header": {
    "format": {
      "time": {
        "military": false
      },
      "date": "Do MMMM YYYY"
    }
  }
```

#### time

##### military

Should the time be in military format? (24 hour) Default is `false`.

```json
  "header": {
    "format": {
      "time": {
        "military": true
      }
    }
  }
```

#### date

Set a custom date format. Refer to the
 [momentjs docs][moment-docs] for more info. Default is `Do MMMM YYYY`.

```json
  "header": {
    "format": {
      "date": "dddd, MMMM Do YYYY"
    }
  }
```

### left_outdoor_weather

This section is used for setting the `entity_id`'s of weather sensors.
 These are meant for outdoor sensors, but can be anything that has a `state`.

![Left Outdoor Weather Screenshot][weather-left]

#### dark_sky_icon

This is the `entity_id` of your [Dark Sky][dark-sky] icon sensor.

```json
      "dark_sky_icon": "sensor.dark_sky_icon",
```

#### condition

This is the `entity_id` that describes the current weather conditions.

```json
      "condition": "sensor.pws_weather",
```

#### data

This is an array of the `entity_id`'s that describes the current weather
 conditions. `unit_of_measurement` is added onto the end of the
 sensor's `state`.

```json
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
```

### right_indoor

This is an array of grouped sensors which are labelled by a larger set of text.

![Right Indoor Screenshot][weather-right]

```json
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
      },
      {
        "label": "Upstairs",
        "data": [
          {
            "entity_id": "sensor.sn2_temperature",
            "unit_of_measurement": "°C"
          },
          {
            "entity_id": "sensor.sn2_humidity",
            "unit_of_measurement": "%"
          }
        ]
      }
```

#### label

Text shown above sensor data.

```json
        "label": "Living Room",
```

#### data

This is an array of the `entity_id`'s that describes the current weather
 conditions. `unit_of_measurement` is added onto the end of the
 sensor's `state`.

```json
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
```

## items

The main view. Where all the cards, cameras, links etc. go. First give the
 group of cards a name, then add what you want. See below for the available
 types of cards.

```json
  "items": [
    {
      "name": "Scenes",
      "cards": [
        {
          "entity_id": "scene.reset_lights"
        },
        {
          "entity_id": "scene.reset_kitchen_lights"
        },
        {
          "entity_id": "scene.lights_on"
        },
        {
          "entity_id": "scene.lights_off"
        },
        {
          "entity_id": "scene.all_lights_on"
        },
        {
          "name": "Night/Film Mode",
          "entity_id": "scene.night_mode"
        }
      ]
    },
    {
      "name": "Living Room",
      "cards": [
        {
          "entity_id": "light.setee_light"
        },
        {
          "entity_id": "light.tv_light"
        }
      ]
    },
    {
      "name": "Links/Cameras",
      "cards": [
        {
          "type": "link",
          "name": "Shinobi",
          "url": "http://myserver.local:8080"
        },
        {
          "type": "camera",
          "name": "Office",
          "still_url": "http://myserver.local:8080/accesscode/jpeg/groupid/name/s.jpg",
          "url": "http://myserver.local:8080/accesscode/mjpeg/groupid/name"
        }
      ]
    }
  ]
```

### hass

This is the default type of card. You do not need to set the `type` here as
 the app defaults to this.

```json
        {
          "entity_id": "light.tv_light"
        },
        {
          "name": "Night/Film Mode",
          "entity_id": "scene.night_mode"
        }
```

#### entity_id

The `entity_id` of the [HASS][hass] entity. Switches and lights act as buttons
 which can be toggled on and off and scenes, scripts etc. act as
 non-toggleable buttons.

```json
          "entity_id": "light.tv_light"
```

Lights can also be clicked and held / long pressed to
 set brightness, temperature, effect, color etc. in a more info dialog:

![More Info Screenshot][more-info-dark]

#### name

The name is automatically pulled from [HASS][hass], but you can set a custom
 name if you like.

```json
          "name": "Night/Film Mode",
```

#### icon

Icon shown in the middle of the card. Use [Material Design Icons][mdi] to
 find the icon you want to use. For example, to use `thermometer-lines` add:

```json
          "icon": "thermometer-lines"
```

### link

A simple hyperlink that opens up another webpage in a new tab/window. To
 create a link, you must set the `type` to `link`. You can then set the `url`
 and `name` as appropriate. This looks and acts the same as a normal card.

```json
        {
          "type": "link",
          "name": "Shinobi",
          "url": "http://myserver.local:8080"
        }
```

#### name

The name of the link.

```json
          "name": "Shinobi",
```

#### icon

Icon shown in the middle of the card. Use [Material Design Icons][mdi] to
 find the icon you want to use. For example, to use `thermometer-lines` add:

```json
          "icon": "thermometer-lines"
```

### camera

You can add any camera image supported by your browser. Set the `type` to
 `camera` to use this. Set the `name` as appropriate. The camera type spans
 two cards. Clicking on the camera shows the camera's feed.

```json
        {
          "type": "camera",
          "name": "Office",
          "still_url": "http://myserver.local:8080/accesscode/jpeg/groupid/name/s.jpg",
          "url": "http://myserver.local:8080/accesscode/mjpeg/groupid/name"
        }
```

Another use for the `camera` type is to show an image, instead of a camera, so your
 screen acts as a photo frame.

```json
        {
          "type": "camera",
          "name": "Lake Scene",
          "still_url": "https://images.pexels.com/photos/709881/pexels-photo-709881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          "url": "https://images.pexels.com/photos/709881/pexels-photo-709881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        }
```

![Camera Picture Screenshot][camera-picture]
![Camera Picture Full Screenshot][camera-picture-full]

#### url

The url of the camera feed for use in full screen when the smaller camera card
 is clicked.

```json
          "url": "http://myserver.local:8080/accesscode/mjpeg/groupid/name"
```

#### still_url

The url of a still image for use in the main view. This updates every minute.

```json
          "still_url": "http://myserver.local:8080/accesscode/jpeg/groupid/name/s.jpg"
```

### iframe

You can add any webpage that can be embedded.

```json
        {
          "type": "iframe",
          "name": "Wind",
          "url": "https://embed.windy.com/embed2.html?zoom=5"
        }
```

#### url

The url of the page.

```json
          "url": "https://embed.windy.com/embed2.html?zoom=5"
```

[template]: https://git.timmo.xyz/home-panel/template/
[hass]: https://www.home-assistant.io/
[dark-sky]: https://www.home-assistant.io/components/sensor.darksky/
[more-info-dark]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info-dark.png
[camera-picture]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/camera-picture.png
[camera-picture-full]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/camera-picture-full.png
[header]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/header.png
[weather-left]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/weather-left.png
[weather-right]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/weather-right.png
[themes]: https://git.timmo.xyz/home-panel/themes/
[mdi]: https://materialdesignicons.com
[moment-docs]: https://momentjs.com/docs/#/displaying/format/

# Configuration

To get started, copy the [starter template][template]
 to the `config.json` file.

Now, we will go over the sections you can configure inside the JSON file along
 with examples you can adapt:

## theme

### auto

You can override the way the `auto` theme triggers between light and dark
 mode. The format is similar to the way [Home Assistant's][hass]
 automations work.
 You set the sensor's `entity_id` and the **below** threshhold.

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

## header

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

### left_outdoor_weather

This section is used for setting the `entity_id`'s of weather sensors.
 These are meant for outdoor sensors, but can be anything that has a `state`.

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

TBD

## items

TBD

[template]: https://git.timmo.xyz/home-panel/template/
[hass]: https://www.home-assistant.io/
[dark-sky]: https://www.home-assistant.io/components/sensor.darksky/

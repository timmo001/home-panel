# Starter Template

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

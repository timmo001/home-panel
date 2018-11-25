# Custom Themes

This section covers creating custom themes in the config.

Start by adding an array called `custom` under the `theme` object in the
 config or use the [template][template].

```json
  "theme": {
    "custom": [
        "name": "My Theme",
        "base": "dark",
        "overrides": {

        }
    ]
  }
```

## name

The name of your theme

## base

The theme to use as this theme's base. Start with either `light` or `dark` and
 expand from there

## overrides

This is where you edit the theme. Here is a table of all parts of the theme
 that can be overridden/configured. Replace the dots (.) with an object.
 (`"backgrounds": { ... }`)

| Item                             | What this configures/overrides                                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                             | The top level base. This is the high level theme which can only be `light` or `dark`. Generally this isn't required when using the light or dark theme as the `base` |
| primary                          | The primary color that the UI uses. This is used for sliders, dropdowns, etc.                                                                                        |
| secondary                        | The secondary color that the UI uses.                                                                                                                                |
| backgrounds.main                 | The main background. This can be a color or a picture. You must use css formatting however, so to use an image, use `url(https://myimageaddress...)`                 |
| backgrounds.default              | The default background that is not defined in this section                                                                                                           |
| backgrounds.navigation           | The background that the bottom navigation uses                                                                                                                       |
| backgrounds.card.on              | The color of the card when on. i.e. the light or switch is turned on.                                                                                                |
| backgrounds.card.off             | The color of the card when switched off or not able to switch on                                                                                                     |
| backgrounds.card.disabled        | The color of the card when the entity is unavailable.                                                                                                                |
| backgrounds.card.alarm.home      | The color of an alarm card and it is armed home.                                                                                                                     |
| backgrounds.card.alarm.away      | The color of an alarm card and it is armed away.                                                                                                                     |
| backgrounds.card.alarm.triggered | The color of an alarm card and the alarm has been triggered.                                                                                                         |
| text.light                       | The color of the lighter text areas                                                                                                                                  |
| text.main                        | The color of the main text areas                                                                                                                                     |
| text.icon                        | The color of the icons. This is for the icons on the cards, if added.                                                                                                |

## Colors

To set the color you can use any color using the hex value, Material colors or
 even images for backgrounds.

### Material Color

To use Material colors, you can use the [Material Design Pallette][md-color]
 to find the color you want, then using them like so:

```json
            "main": "blueGrey[500]",
```

See how `Blue Grey` becomes camel-cased as `blueGrey`. The `[500]` is the
 exact color. This would result in `#607D8B`.

### Hexadecimal color

You can use hexadecimal values to set colors using the usual `#RRGGBB` format.

### Image

For backgrounds, you can set an image for the background if you like.
 The only caveat to this is that you have to use css formatting.

To add an image set it as a `url` like so:

```json
"main": "url(https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg)",
```

Make sure to put the url in brackets like the above.

## Example Themes

Here are some example themes you can use or expand on.
 Contributions are welcome!

### Midnight

```json
      {
        "name": "Midnight",
        "base": "dark",
        "overrides": {
          "primary": "pink",
          "backgrounds": {
            "main": "#383c45",
            "default": "#383c45",
            "card": {
              "on": "pink[600]",
              "off": "#434954",
              "disabled": "#7f848e",
              "alarm": {
                "home": "pink[600]",
                "away": "pink[600]"
              }
            }
          },
          "text": {
            "light": "grey[50]",
            "main": "grey[100]"
          }
        }
      }
```

![Midnight Theme][midnight-theme]

### Forest

```json
      {
        "name": "Forest",
        "base": "light",
        "overrides": {
          "backgrounds": {
            "main": "url(https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg)",
            "card": {
              "on": "lightGreen[700]",
              "off": "green[50]",
              "alarm": {
                "home": "lightGreen[700]",
                "away": "lightGreen[700]"
              }
            }
          }
        }
      }
```

![Forest Theme][forest-theme]

[template]: https://git.timmo.xyz/home-panel/template/
[md-color]: https://material.io/design/color/#tools-for-picking-colors
[midnight-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/midnight-theme.png
[forest-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/forest-theme.png

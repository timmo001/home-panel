# Custom Themes

This section covers creating custom themes in the config.

Start by adding an array called `custom` under the `theme` object in the
 config or use the [template][template].

```json
  "theme": {
    "custom": [
    ]
  }
```

## Configurable items

Here is a table of all parts of the theme that can be overridden/configured.
 Replace the dots (.) with an object. (`"backgrounds": { ... }`)

| Item                       | What this configures/overrides                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                       | The top level base. This is the high level theme which can only be light or dark. Generally this isn't needed when using the light or dark theme as the `base` |
| primary                    | The primary color that the UI uses. This is used for sliders, dropdowns, etc.                                                                                  |
| secondary                  | The secondary color that the UI uses.                                                                                                                          |
| backgrounds.main           | The main background. This can be a color or a picture. You must use css formatting however, so to use an image, use `url(https://myimageaddress...)            |
| backgrounds.default        | The background that other sections use that don't already have. This is generally not needed.                                                                  |
| backgrounds.card.on        | The color of the card when on. i.e. the light or switch is turned on.                                                                                          |
| backgrounds.card.off       | The color of the card when switched off or not able to switch on                                                                                               |
| backgrounds.card.disabled  | The color of the card when the entity is unavailable.                                                                                                          |
| theme.overrides.text.light | The color of the lighter text and icons                                                                                                                        |
| theme.overrides.text.main  | The color of the main text and icons. This is mostly the header section with the time, weather etc.                                                            |

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
              "disabled": "#7f848e"
            }
          },
          "text": {
            "light": "grey[50]",
            "main": "grey[100]"
          }
        }
      }
```

![Midnight Theme][theme-midnight]

### Forest

```json
      {
        "name": "Forest",
        "base": "light",
        "overrides": {
          "primary": "lightGreen",
          "backgrounds": {
            "main": "url(https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg)",
            "card": {
              "on": "lightGreen[700]",
              "off": "green[50]"
            }
          }
        }
      }
```

![Forest Theme][theme-forest]

[template]: https://git.timmo.xyz/home-panel/template/
[md-color]: https://material.io/design/color/#tools-for-picking-colors
[theme-midnight]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/theme-midnight.png
[theme-forest]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/theme-forest.png

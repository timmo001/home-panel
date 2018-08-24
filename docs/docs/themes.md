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

Here is a table of all parts of the theme that can be overridden/configured. Replace the dots (.) with an object. (`"backgrounds": { ... }`)

|            Item            |                                                                 What this configures/overrides                                                                 |
|:--------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| type                       | The top level base. This is the high level theme which can only be light or dark. This is generally not needed when using the light or dark theme as the `base` |
| primary                    | The primary color that the UI uses.                                                                                                                            |
| secondary                  | The secondary color that the UI uses.                                                                                                                          |
| backgrounds .main          | The main background. This can be a color or a picture. You must use css formatting however, so to use an image, use `url(https://myimageaddress...)`           |
| backgrounds .default       | The background that other sections use that don't already have. This is generally not needed.                                                                  |
| backgrounds .card .on      | The color of the card when on. i.e. the light or switch is turned on.                                                                                          |
| backgrounds .card .off     | The color of the card when switched off or not able to switch on                                                                                               |
| backgrounds.card.disabled  | The color of the card when the entity is unavailable.                                                                                                          |
| theme.overrides.text.light | The color of the lighter text and icons                                                                                                                        |
| theme.overrides.text.main  | The color of the main text and icons. This is mostly the header section with the time, weather etc.                                                            |

## Example Themes

Here are some example themes you can use or expand on:

### Midnight

```json
      {
        "name": "Midnight",
        "base": "dark",
        "overrides": {
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

### Forest

```json
      {
        "name": "Forest",
        "base": "light",
        "overrides": {
          "backgrounds": {
            "main": "url(https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)",
            "card": {
              "on": "lightGreen[700]",
              "off": "green[50]"
            }
          }
        }
      }
```

[template]: https://git.timmo.xyz/home-panel/template/

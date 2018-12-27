# Home Panel

[![GitHub Release](https://img.shields.io/github/release/timmo001/home-panel.svg)](https://github.com/timmo001/home-panel/releases)
[![License](https://img.shields.io/github/license/timmo001/home-panel.svg)](https://github.com/timmo001/home-panel/blob/master/LICENSE.md)
[![pipeline status](https://gitlab.com/timmo/home-panel/badges/master/pipeline.svg)](https://gitlab.com/timmo/home-panel/commits/master)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/timmo001/home-panel.svg?columns=To%20Do,On%20Hold,In%20Progress,Done)](https://waffle.io/timmo001/home-panel)

[![Docker Version][version-shield]][microbadger]
[![Docker Layers][layers-shield]][microbadger]
[![Docker Pulls][pulls-shield]][dockerhub]
[![Anchore Image Overview][anchore-shield]][anchore]

![Supports armhf Architecture][armhf-shield]
![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]
![Supports i386 Architecture][i386-shield]

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

A touch-compatible web frontend for controlling the home. Integrates with
 [Home Assistant][hass] as an alternative / additional frontend.

![banner][banner]

## Features

- Card based user interface with support for [Home Assistant][hass]
- Supports MJPEG and related image-based camera/image feeds. Images can also
 be used
- Light control with brightness, temperature, color and effects support
- Supports Radio playback from TuneIn
- Add weather and weather icons using Home Assistant's
 [Dark Sky](https://www.home-assistant.io/components/weather.darksky/)
 component
- Made for touch screens with a sideways scrolling Material
 Design interface. (Compatible with desktops as well)
- Customizable interface
- Custom theme support

## Demo

You can use a demo of this app [here][demo-app].

> This will only work with Home Assistant instances served over HTTPS

## Docs

Setup and configuration is available [here][setup-docs]

## Links

[Support / Discussion][forum]

[Contribution Guidelines][CONTRIBUTING]

[Code of Conduct][CODE_OF_CONDUCT]

## Screenshots

![Light Theme Screenshot][light-theme]

![Midnight Theme Screenshot][midnight-theme]

![Forest Theme][forest-theme]

![Radio Screenshot][radio]

![More Info Dark Screenshot][more-info-dark]

## License

MIT License

Copyright (c) Timmo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[light-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/light-theme.png
[midnight-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/midnight-theme.png
[more-info-light]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info-light.png
[more-info-dark]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info-dark.png
[radio]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/radio.png
[forest-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/forest-theme.png
[anchore-shield]: https://anchore.io/service/badges/image/9577aceb95056f417958e6bb7536cc0394b5add554df0c63780875f3669f5c2e
[anchore]: https://anchore.io/image/dockerhub/timmo001%2Fhome-panel%3Alatest
[dockerhub]: https://hub.docker.com/r/timmo001/home-panel
[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armhf-shield]: https://img.shields.io/badge/armhf-yes-green.svg
[i386-shield]: https://img.shields.io/badge/i386-yes-green.svg
[layers-shield]: https://images.microbadger.com/badges/image/timmo001/home-panel.svg
[microbadger]: https://microbadger.com/images/timmo001/home-panel
[pulls-shield]: https://img.shields.io/docker/pulls/timmo001/home-panel.svg
[version-shield]: https://images.microbadger.com/badges/version/timmo001/home-panel.svg
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg
[buymeacoffee]: https://www.buymeacoffee.com/timmo
[hass]: https://www.home-assistant.io/
[setup-docs]: https://git.timmo.xyz/home-panel/setup/
[forum]: https://community.home-assistant.io/t/home-panel-a-touch-compatible-webapp-for-controlling-the-home/62597
[CONTRIBUTING]: https://github.com/timmo001/home-panel/blob/master/.github/CONTRIBUTING.md
[CODE_OF_CONDUCT]: https://github.com/timmo001/home-panel/blob/master/.github/CODE_OF_CONDUCT.md
[demo-app]: https://home-panel-demo.timmo.xyz/
[banner]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/banner.png

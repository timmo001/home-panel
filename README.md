# Home Panel

[![GitHub Release](https://img.shields.io/github/release/timmo001/home-panel.svg)](https://github.com/timmo001/home-panel/releases)
[![License](https://img.shields.io/github/license/timmo001/home-panel.svg)](https://github.com/timmo001/home-panel/blob/master/LICENSE.md)
[![pipeline status](https://gitlab.com/timmo/home-panel/badges/master/pipeline.svg)](https://gitlab.com/timmo/home-panel/commits/master)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/timmo001/home-panel.svg?columns=To%20Do,On%20Hold,In%20Progress,Done)](https://waffle.io/timmo001/home-panel) [![Greenkeeper badge](https://badges.greenkeeper.io/timmo001/home-panel.svg)](https://greenkeeper.io/)

[![Docker Version][version-shield]][microbadger]
[![Docker Layers][layers-shield]][microbadger]
[![Docker Pulls][pulls-shield]][dockerhub]
[![Anchore Image Overview][anchore-shield]][anchore]

A touch-compatible web-app for controlling the home. Integrates with
 [Home Assistant][hass] as an alternative / additional frontend.

## Features

- Card based user interface with support for [HASS][hass] entities, links and
 cameras.
- Supports and can be used as alternate / additional frontend for
 [Home Assistant][hass]
- Supports MJPEG and related image-based camera/image feeds
 (can also be used as a photo frame)
- Light control with brightness, temperature, color, effects etc. support
- Supports Radio playback from TuneIn API
- Add weather and weather icons using Home Assistant's
 [Dark Sky](https://www.home-assistant.io/components/weather.darksky/)
 component
- Made for touch screens with a sideways scrolling Material
 Design interface. (Compatible with desktops as well)

## Screenshots

![Light Theme Screenshot][light-theme]
![More Info Light Screenshot][more-info-light]

![Dark Theme Screenshot][dark-theme]
![More Info Dark Screenshot][more-info-dark]

![Radio Screenshot][radio]

## Docs

Setup and configuration is available [here][docs]

[light-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/light-theme.png
[dark-theme]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/dark-theme.png
[more-info-light]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info-light.png
[more-info-dark]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/more-info-dark.png
[radio]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/radio.png
[anchore-shield]: https://anchore.io/service/badges/image/9577aceb95056f417958e6bb7536cc0394b5add554df0c63780875f3669f5c2e
[anchore]: https://anchore.io/image/dockerhub/timmo001%2Fhome-panel%3Alatest
[dockerhub]: https://hub.docker.com/r/timmo001/home-panel
[layers-shield]: https://images.microbadger.com/badges/image/timmo001/home-panel.svg
[microbadger]: https://microbadger.com/images/timmo001/home-panel
[pulls-shield]: https://img.shields.io/docker/pulls/timmo001/home-panel.svg
[version-shield]: https://images.microbadger.com/badges/version/timmo001/home-panel.svg
[hass]: https://www.home-assistant.io/
[docs]: https://git.timmo.xyz/home-panel/

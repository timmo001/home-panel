---
title: "Docker"
date: 2018-07-20T12:56:26+01:00
draft: true
---

- Install [Docker](https://www.docker.com/community-edition)
- Create a `config.json` using the template below
- Run image

  ```bash
  docker run -d \
  -e REACT_APP_HASS_HOST='hassioserver.com' \
  -e REACT_APP_HASS_PASSWORD='supersecurepassword' \
  -e REACT_APP_HASS_SSL='true' \
  -p 8234:443 \
  -v ~/ssl:/ssl \
  -v $(pwd)/config.json:/usr/src/app/config.json \
  timmo001/home-panel
  ```

---
title: "NodeJS"
date: 2018-07-20T12:56:26+01:00
draft: true
---

- Clone this repository
- Checkout the version you want via releases
- Copy `.env` to `.env.local` and update it to use your own Home Assistant details
- Rename `config.template.json` to `config.json`

  ```bash
  cp config.template.json src/config.json
  ```

- Update `src/config.json` to your configuration. (See below for sample and options)
- Install packages

  ```bash
  yarn install
  ```

- Copy `config.json` into `node_modules/config.json`

  ```bash
  cp config.json node_modules/
  ```

- Build a production version

  ```bash
  yarn build
  ```

## Production - Secure

- Install nginx
- Edit your server config `/etc/nginx/conf.d/default.conf`

  ```conf
  server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;

    root /usr/share/nginx/html;
    index index.html;
    server_name 172.0.0.1;

    ssl_certificate /ssl/fullchain.pem;
    ssl_certificate_key /ssl/privkey.pem;

    location / {
      try_files $uri /index.html;
    }
  }
  ```

- Copy the files in the build folder into nginx's html directory at
 `/usr/share/nginx/html`
- Start your server

## Production

> **This option is not secure. Do not open to the outside world!**

- Install serve

  ```bash
  sudo yarn global add serve
  ```

- Serve the site

  ```bash
  serve -s build
  ```

- Open the app in your browser at `http://localhost:5000`

## Development

> **This option is not secure. Do not open to the outside world!**

- Run the app

  ```yarn start```

- The app should open in your default browser under `http://localhost:3000`

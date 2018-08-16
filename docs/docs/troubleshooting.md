# Troubleshooting

## Use the latest version

If your are facing any issues logging in, connecting etc. you should first
 make sure you are running the latest version.

If you are running Docker, run:

```bash
docker pull timmo001/home-panel
docker pull timmo001/home-panel-api
```

and run the containers again. You may have to clear the cache/cookies in your
 browser.

If running natively, checkout the latest version from the release page for
 the [app] and the [API] and rerun the app.

If you are still having issues, you can post on the Home Assistant
 [forum thread] where the community will be able to help you if not myself.

## Before posting your issue

Before posting your issue, make sure you check the logs for any errors.
 You may be able to find out the issue for yourself.

If your issue is inside the webapp, first check the developer console.
 To do this press `F12` on the keyboard if you are running Chrome.

Also check the main app logs. With Docker Compose, just `cd` into the
 `docker-compose.yml` directory and run:

 ```bash
 docker-compose logs -f
 ```

 If using Docker, run:

```bash
docker logs -f CONTAINER_ID
```

If you are still stuck, post these logs to the [forum thread] (make sure to
 remove any personal data such as a public address etc.)

[app]: https://github.com/timmo001/home-panel/releases
[api]: https://github.com/timmo001/home-panel-api/releases
[forum thread]: https://community.home-assistant.io/t/home-panel-a-touch-compatible-webapp-for-controlling-the-home/62597

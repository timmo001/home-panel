# Troubleshooting

## Check the docs

Make sure you review the setup docs. These will always be the most up to date
 source of how to setup the app. It is always worth checking your config
 against the [setup] docs.

For login and account issues, check against the [login] docs.

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
 the [app] and the [api] and rerun the app.

## Before posting your issue

Before posting your issue, make sure you check the logs for any errors.
 You may be able to find out the issue for yourself.

If your issue is inside the webapp, first check the developer console.
 To do this press `F12` on the keyboard if you are running Chrome.

Also check the main app logs. With Docker Compose, `cd` into the
directory containing `docker-compose.yml` and run:

 ```bash
 docker-compose logs -f
 ```

If using Docker, run:

```bash
docker logs -f APP_CONTAINER_ID
docker logs -f API_CONTAINER_ID
```

## I'm still having issues

If you are still stuck, post any logs you can gather from the steps above
 to the [forum thread] where the community will be able to help you.
 Make sure to remove any personal data such as a public address or password.

[app]: https://github.com/timmo001/home-panel/releases
[api]: https://github.com/timmo001/home-panel-api/releases
[forum thread]: https://community.home-assistant.io/t/home-panel-a-touch-compatible-webapp-for-controlling-the-home/62597
[setup]: https://git.timmo.xyz/home-panel/setup/
[login]: https://git.timmo.xyz/home-panel/login/

# Before posting your issue

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

If you are using the Hass.io add-on, you can check the logs in the add-on page.

## Where to post to

You can also post an issue to the [GitHub repository]. If your issue is
 related to the Hass.io add-on, post your issue [here]

[GitHub repository]: https://github.com/timmo001/home-panel/issues
[here]: https://github.com/hassio-addons/addon-home-panel/issues

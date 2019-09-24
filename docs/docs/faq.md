# FAQ

## I am using charts for my entities, but they are not showing

You may need to add the URL for Home Panel to your CORS headers for Home
Assistant. More details [here](https://www.home-assistant.io/components/http/#cors_allowed_origins)

```yaml
http:
  cors_allowed_origins:
    - https://<your_home_panel_url>:<your_home_panel_port>
```

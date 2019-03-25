# Account creation and login

This screen communicates with the API to log in the the user and get the
config. Once this is done, the login will be remembered automatically.
(If you clear your cookies/cache or recreate the app,
you will need to login or create a new account again)

You will need to authenticate the app on login to Home Assistant using one of
the users you have setup on Home Assistant.

## Create Account

On your first run of the app, you will be presented with an account creation screen:

![Create Account][account-creation]

If you already have a user setup, click the `Already have an account?` button.

Once you have entered all this information, click `Create Account` and you
will be automatically logged in.

There are 5 steps to creating a new account for a user.

### Username

The username you will use to login.

### Password

The password you will use to login.

### API URL

The URL of the API. You should include the full address. For example:

- `https://localhost:3234`
- `http://localhost:3234`
- `https://myserver.local:3234`

### Home Assistant URL

Enter your Home Assistant instance's url including the port if required.

Example URLs:

- `https://my.ddns.address`
- `http://localhost:8123`
- `http://192.168.1.100:8123`
- `https://mylocalserverhostname.local:8123`

## Login

Once you have created an account, you may get this screen:

![Login][account-login]

If you need to create a new account or your credentials have changed,
Click the `Create New Account` button.

Enter your username and password you used previously and click `Log In`.

[account-creation]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/account-creation.png
[account-login]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/account-login.png

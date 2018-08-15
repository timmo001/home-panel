# Account creation and login

This screen communicates with the API to log in the the user and get the
 config. Once this is done, the login will be remembered automatically.
 (If you clear your cookies/cache or recreate the app,
 you will need to login or create a new account again)

## Create Account

On your first run of the app, you will be preseted with an account creation screen:

![Create Account][account-creation]

If you already have a user setup, click the `Already have an account?` button.

Once you have entered all this information, click `Create Account` and you
 will be automatically logged in.

There are 5 steps to creating a new account for a user.

### Username

The username you will use to login.

### Password

The password you will use to login.

### Home Assistant Host

Enter your Home Assistant instance's hostname including the port if required.
 (Ports `80` and `443` are not required) You do not need the `https://` or
 `http://` part of the url. This will not work.

Example hostnames:

- `localhost:8123`
- `my.ddns.address`
- `192.168.1.100:8123`
- `mylocalserverhostname.local:8123`

### Home Assistant Password

The password you use to login to Home Assistant.

### Home Assistant SSL

Keep this box checked if your home assistant instance is secured.
 Those using Home Assistant locally will likely need to switch this off.

## Login

Once you have created an account, you may get this screen:

![Login][account-login]

If you need to create a new account or your credentials have changed,
 Click the `Create New Account` button.

Enter your username and password you used previously and click `Log In`.

[account-creation]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/account-creation.png
[account-login]: https://raw.githubusercontent.com/timmo001/home-panel/master/docs/resources/account-login.png

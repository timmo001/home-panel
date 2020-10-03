import React, { useEffect, useCallback, ReactElement, useState } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import green from "@material-ui/core/colors/green";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { Page } from "./Types/Types";
import Logo from "../Resources/logo.svg";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    background: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing(0.5, 1),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(-1),
  },
  margin: {
    margin: theme.spacing(0.5, 1),
  },
  media: {
    backgroundSize: "contain",
    height: 240,
  },
  textField: {
    flexBasis: "50%",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(1),
  },
}));

export interface Auth {
  strategy: string;
  username: string;
  password: string;
}

interface LoginProps {
  handleCreateAccount(data: Auth, callback?: (error?: string) => void): void;
  handleSetCurrentPage: (page: Page) => void;
  handleLogin(data: Auth, callback?: (error?: string) => void): void;
}

interface State {
  username: string;
  password: string;
}

const firstTime =
  localStorage.getItem("not_my_first_rodeo") === "true" ? false : true;
function Login(props: LoginProps): ReactElement {
  const [createAccount, setCreateAccount] = useState<boolean>(firstTime);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [invalidText, setInvalidText] = useState<string>();
  const [errorText, setErrorText] = useState<string>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<State>({
    username: "",
    password: "",
  });

  const handleValidation = useCallback(() => {
    if (!values.username) {
      setInvalidText("No username!");
      return;
    }
    if (!values.password) {
      setInvalidText("No password!");
      return;
    }
    setInvalidText(undefined);
  }, [values.username, values.password]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  function toggleCreateAccount(): void {
    setCreateAccount(!createAccount);
  }

  function handleCreateAccount(): void {
    setLoading(true);
    localStorage.setItem("not_my_first_rodeo", "true");
    props.handleCreateAccount(
      {
        strategy: "local",
        username: values.username,
        password: values.password,
      },
      (error?: string) => {
        setLoading(false);
        if (error) {
          setLoginSuccess(false);
          setErrorText(error);
        } else {
          setLoginSuccess(true);
          setTimeout(() => props.handleSetCurrentPage("Overview"), 500);
        }
      }
    );
  }

  function handleLogin(): void {
    setLoading(true);
    props.handleLogin(
      {
        strategy: "local",
        username: values.username,
        password: values.password,
      },
      (error?: string) => {
        setLoading(false);
        if (error) {
          setLoginSuccess(false);
          setErrorText(error);
        } else {
          setLoginSuccess(true);
          setTimeout(() => props.handleSetCurrentPage("Overview"), 500);
        }
      }
    );
  }

  function handleClickShowPassword(): void {
    setShowPassword(!showPassword);
  }

  function handleKeyPress(event: { key: string }): void {
    handleValidation();
    if (event.key === "Enter" && !invalidText) {
      createAccount ? handleCreateAccount() : handleLogin();
    }
  }

  function handleMouseDownPassword(event: {
    preventDefault: () => void;
  }): void {
    event.preventDefault();
  }

  const handleChange = (name: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setValues({ ...values, [name]: event.target.value });
  };

  const classes = useStyles();
  const buttonClassname = clsx(classes.button, {
    [classes.buttonSuccess]: loginSuccess,
  });
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="center"
      alignContent="center"
      alignItems="center">
      <Grid item>
        <CardMedia className={classes.media} image={Logo} title="Home Panel" />
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          component="form">
          <Typography
            color="textPrimary"
            variant="h5"
            component="h2"
            align="center">
            {createAccount ? "Welcome!" : "Login"}
          </Typography>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              required
              id="username"
              type="text"
              inputProps={{
                autoCapitalize: "none",
                autoComplete: "username",
              }}
              value={values.username || ""}
              onChange={handleChange("username")}
              onKeyPress={handleKeyPress}
            />
          </FormControl>
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              required
              id="password"
              type={showPassword ? "text" : "password"}
              inputProps={{
                autoCapitalize: "none",
                autoComplete: createAccount
                  ? "new-password"
                  : "current-password",
              }}
              value={values.password || ""}
              onChange={handleChange("password")}
              onKeyPress={handleKeyPress}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container direction="column" justify="center" alignContent="center">
        <div className={classes.wrapper}>
          {errorText && <Typography color="error">{errorText}</Typography>}
          {invalidText && (
            <Typography color="error" variant="subtitle1">
              {invalidText}
            </Typography>
          )}
        </div>
        <div className={classes.wrapper}>
          <Button
            className={classes.button}
            size="small"
            variant="contained"
            onClick={toggleCreateAccount}>
            {createAccount ? "Already have an account?" : "Create New Account"}
          </Button>
          {createAccount === true ? (
            <Button
              className={buttonClassname}
              size="small"
              variant="contained"
              color="primary"
              disabled={loading || invalidText ? true : false}
              onClick={handleCreateAccount}>
              Sign Up
              {loading && (
                <CircularProgress
                  size={18}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          ) : (
            <Button
              className={buttonClassname}
              size="small"
              variant="contained"
              color="primary"
              disabled={loading || invalidText ? true : false}
              onClick={handleLogin}>
              Log In
              {loading && (
                <CircularProgress
                  size={18}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          )}
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;

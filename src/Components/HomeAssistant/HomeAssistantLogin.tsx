// @flow
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import HALogin from '../../Resources/ha-login.svg';
import FormControl from '@material-ui/core/FormControl';
import { DialogTitle } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%'
  },
  media: {
    width: '100%',
    height: 48
  }
}));

interface HomeAssistantLoginProps {
  handleHassLogin: (url: string) => void;
}

function HomeAssistantLogin(props: HomeAssistantLoginProps) {
  const [showDialog, setShowDialog] = React.useState(false);
  const [url, setUrl] = React.useState(
    `${process.env.REACT_APP_API_PROTOCOL ||
      window.location.protocol}//hassio.local:8123`
  );
  const [invalidText, setInvalidText] = React.useState();

  const handleValidation = useCallback(() => {
    if (!url) {
      setInvalidText('No Home Assistant URL.');
      return;
    }
    if (!url.startsWith('http') || !url.includes('://')) {
      setInvalidText('Home Assistant URL invalid!');
      return;
    }
    if (window.location.protocol === 'https:') {
      if (url.startsWith('http:')) {
        setInvalidText('Your HASS instance must use SSL/https.');
        return;
      }
    }
    setInvalidText(undefined);
  }, [url]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  function handleToggleDialog() {
    setShowDialog(!showDialog);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
    handleValidation();
  }

  function handleLogin() {
    props.handleHassLogin(url);
    setShowDialog(false);
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ButtonBase className={classes.root} onClick={handleToggleDialog}>
        <CardMedia
          className={classes.media}
          image={HALogin}
          title="Log in to Home Assistant"
        />
      </ButtonBase>
      {showDialog && (
        <Dialog open>
          <DialogTitle>Log in to Home Assistant</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel htmlFor="url" shrink={true}>
                Home Assistant URL
              </InputLabel>
              <Input
                required
                id="url"
                type="text"
                placeholder="https://hassio.local:8123"
                inputProps={{
                  autoFocus: true,
                  autoCapitalize: 'none',
                  autoComplete: 'url'
                }}
                value={url}
                onChange={handleChange}
              />
            </FormControl>
            {invalidText && (
              <Typography color="error" variant="subtitle1">
                {invalidText}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleToggleDialog}>Cancel</Button>
            <Button disabled={invalidText ? true : false} onClick={handleLogin}>
              Log in
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

HomeAssistantLogin.propTypes = {
  handleHassLogin: PropTypes.func.isRequired
};

export default HomeAssistantLogin;

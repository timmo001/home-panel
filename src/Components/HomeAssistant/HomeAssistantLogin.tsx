import React, { useEffect, useCallback, ReactElement } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import HALogin from '../../Resources/ha-login.svg';
import FormControl from '@material-ui/core/FormControl';
import { DialogTitle } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
  },
  media: {
    width: '100%',
    height: 48,
  },
  icon: {
    fontSize: 22,
  },
}));

interface HomeAssistantLoginProps {
  iconOnly?: boolean;
  handleHassLogin: (url: string) => void;
}

function HomeAssistantLogin(props: HomeAssistantLoginProps): ReactElement {
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState<string>(
    `${
      process.env.REACT_APP_API_PROTOCOL || window.location.protocol
    }//homeassistant.local:8123`
  );
  const [invalidText, setInvalidText] = React.useState<string>();

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

  function handleToggleDialog(): void {
    setShowDialog(!showDialog);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setUrl(event.target.value);
    handleValidation();
  }

  function handleLogin(): void {
    props.handleHassLogin(url);
    setShowDialog(false);
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ListItem button onClick={handleToggleDialog}>
        {props.iconOnly ? (
          <ListItemIcon>
            <span
              className={classnames('mdi', 'mdi-home-assistant', classes.icon)}
            />
          </ListItemIcon>
        ) : (
          <CardMedia
            className={classes.media}
            image={HALogin}
            title="Log in to Home Assistant"
          />
        )}
      </ListItem>
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
                placeholder="https://homeassistant.local:8123"
                inputProps={{
                  autoFocus: true,
                  autoCapitalize: 'none',
                  autoComplete: 'url',
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

export default HomeAssistantLogin;

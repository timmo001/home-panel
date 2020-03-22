import React, { ReactElement } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
  text: {
    overflow: 'hidden',
    userSelect: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
  },
}));

interface MessageProps {
  type: '' | 'info' | 'warning' | 'error';
  text: string;
  padding?: string | number;
}

function Message(props: MessageProps): ReactElement {
  let color = '';
  switch (props.type) {
    case 'info':
      color = 'teal';
      break;
    case 'warning':
      color = 'orange';
      break;
    case 'error':
      color = 'red';
      break;
  }

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper
      className={classes.root}
      variant="outlined"
      style={{
        backgroundColor: color,
        padding: props.padding ? props.padding : theme.spacing(1),
      }}>
      <Typography className={classes.text} component="h4" variant="subtitle1">
        {props.text}
      </Typography>
    </Paper>
  );
}

export default Message;

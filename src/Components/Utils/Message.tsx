import React, { ReactElement } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      style={{
        backgroundColor: color,
        padding: props.padding ? props.padding : theme.spacing(1)
      }}>
      <Typography component="h4" variant="subtitle1">
        {props.text}
      </Typography>
    </Paper>
  );
}

export default Message;

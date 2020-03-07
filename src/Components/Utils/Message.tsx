import React, { ReactElement } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

interface MessageProps {
  type: '' | 'info' | 'warning' | 'error';
  text: string;
}

function Message(props: MessageProps): ReactElement {
  let color = '';
  switch (props.type) {
    case 'info':
      color = 'teal';
    case 'warning':
      color = 'orange';
    case 'error':
      color = 'red';
  }

  return (
    <Paper variant="outlined" style={{ backgroundColor: color }}>
      <Typography component="h4" variant="h5">
        {props.text}
      </Typography>
    </Paper>
  );
}

export default Message;

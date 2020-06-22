import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';

import { ChecklistItem } from '../../Configuration/Config';

const useStyles = makeStyles(() => ({
  inputChecked: {
    textDecoration: 'line-through',
  },
}));

interface ItemProps {
  item: ChecklistItem;
  handleUpdateItem: (item: ChecklistItem) => void;
}

let updateTimeout: NodeJS.Timeout;
function Checklist(props: ItemProps): ReactElement | null {
  const [checked, setChecked] = useState<boolean>(props.item.checked);
  const [text, setText] = useState<string>(props.item.text);

  const handleUpdateItem = useCallback(
    (item: ChecklistItem) => {
      console.log('handleUpdateItem:', item);
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => props.handleUpdateItem(item), 500);
    },
    [props]
  );

  const handleCheckedChange = useCallback(
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setChecked(checked);
    },
    []
  );

  const handleTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    []
  );

  useEffect(() => {
    if (checked !== props.item.checked || text !== props.item.text)
      handleUpdateItem({ checked, text });
  }, [props.item, checked, text, handleUpdateItem]);

  const classes = useStyles();
  return (
    <Grid component="form" item xs={12}>
      <Checkbox
        checked={checked}
        inputProps={{ 'aria-label': 'checked' }}
        onChange={handleCheckedChange}
      />
      <InputBase
        className={clsx(checked && classes.inputChecked)}
        disabled={checked}
        inputProps={{ 'aria-label': 'text' }}
        multiline
        value={text}
        onChange={handleTextChange}
      />
    </Grid>
  );
}

export default Checklist;

import React, { useEffect, useState, useCallback, ReactElement } from 'react';
import Fuse from 'fuse.js';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  },
  menu: {
    zIndex: 2000
  }
}));

export interface SuggestionType {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SuggestionType[];
  handleChange: (value: any) => void;
}

let PopperNode: HTMLDivElement | null | undefined;

function Select(props: SelectProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions]: SuggestionType[] | any[] = useState([]);

  const filterSuggestions = useCallback(() => {
    const opts: Fuse.FuseOptions<SuggestionType> = {
      keys: ['label', 'value'],
      caseSensitive: false,
      minMatchCharLength: 2,
      threshold: 0.2
    };
    const fuse = new Fuse(props.options, opts);
    const results = fuse.search(search);
    setSuggestions(
      (Array.isArray(results) ? results : props.options).slice(0, 40)
    );
  }, [props.options, search]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value);
    filterSuggestions();
    setOpen(true);
    props.handleChange('');
  }

  function handleFocus(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setOpen(true);
  }

  const handleChosen = (item: SuggestionType) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ): void => {
    setSearch(item.label);
    props.handleChange(item.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!search && props.options && props.value) {
      const val = props.options.find(
        (option: SuggestionType) => option.value === props.value
      );
      if (val) setSearch(val.label);
    }
  }, [search, props.options, props.value]);

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={props.label}
        placeholder={`Search for ${props.label ? props.label : 'items'}`}
        aria-controls="options"
        aria-haspopup="true"
        ref={(node: HTMLDivElement): void => {
          PopperNode = node;
        }}
        value={search}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      <Popper
        className={classes.menu}
        id="options"
        anchorEl={PopperNode}
        open={open}>
        <Paper
          square
          style={{
            maxHeight: 250,
            width: PopperNode ? PopperNode.clientWidth : undefined,
            marginTop: theme.spacing(1),
            overflow: 'auto'
          }}>
          {suggestions.map((suggestion: SuggestionType, key: number) => (
            <MenuItem
              key={key}
              onClick={handleChosen(suggestion)}
              value={suggestion.value}>
              {suggestion.label}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    </div>
  );
}

export default Select;

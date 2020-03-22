import React, { useEffect, useState, useCallback, ReactElement } from 'react';
import Fuse from 'fuse.js';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';

import { HomeAssistantEntityProps } from '../HomeAssistant';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4,
  },
  menu: {
    zIndex: 2000,
  },
}));

interface SuggestionType {
  label: string;
  value: string;
}

interface EntitySelectProps extends HomeAssistantEntityProps {
  entity?: string;
  handleChange: (value: string) => void;
}

let PopperNode: HTMLDivElement | null | undefined;

function EntitySelect(props: EntitySelectProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();

  const [options, setOptions] = useState<SuggestionType[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);

  const filterSuggestions = useCallback(() => {
    const fuse = new Fuse(options, {
      keys: ['label', 'value'],
      caseSensitive: false,
      minMatchCharLength: 2,
      threshold: 0.2,
    });
    const results = fuse.search(search);
    setSuggestions((Array.isArray(results) ? results : options).slice(0, 20));
  }, [options, search]);

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
    setOptions(
      Object.values(props.hassEntities).map((entity: HassEntity) => ({
        label: entity.attributes.friendly_name
          ? `${entity.attributes.friendly_name} - ${entity.entity_id}`
          : entity.entity_id,
        value: entity.entity_id,
      }))
    );
  }, [props.hassEntities]);

  useEffect(() => {
    if (!search && options && props.entity) {
      const val = options.find(
        (option: SuggestionType) => option.value === props.entity
      );
      if (val) setSearch(val.label);
    }
  }, [search, options, props.entity]);

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        InputLabelProps={{ shrink: true }}
        label="Entity"
        placeholder="Search for entities"
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
            overflow: 'auto',
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

export default EntitySelect;

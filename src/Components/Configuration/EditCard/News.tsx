import React, { useEffect, useState, ReactElement } from 'react';
import request from 'superagent';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import type { BaseProps } from './Base';
import type { Option } from '../../Types/Types';
import properCase from '../../../utils/properCase';

type FeedSource = {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
};

const useStyles = makeStyles(() => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4,
  },
}));

function News(props: BaseProps): ReactElement {
  const [sources, setSources] = useState<Option[]>();
  const [source, setSource] = useState<Option | null>(null);
  const [error, setError] = useState<string>();

  function handleChange(
    _event: React.ChangeEvent<{}>,
    newValue: Option | null
  ): void {
    setSource(newValue);
    props.handleManualChange?.('url', newValue?.value);
  }

  useEffect(() => {
    if (props.config.news && props.config.news.news_api_key) {
      setError(undefined);
      request
        .get(
          `https://newsapi.org/v2/sources?apiKey=${props.config.news.news_api_key}`
        )
        .then((res) => {
          const options: Option[] = res.body.sources.map(
            (source: FeedSource) => ({
              label: `${source.name} - ${properCase(source.category)} - ${
                source.url
              }`,
              value: source.id,
            })
          );
          setSources(options);
          const val = options.find(
            (option: Option) => option.value === props.card.url
          );
          if (val) setSource(val);
        })
        .catch((err) => {
          console.error(err);
          setError('An error occured when getting the sources for News API.');
        });
    } else
      setError(
        'Invalid config or you do not have a News API key set in your config.'
      );
  }, [props.config.news, props.card.url]);

  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" alignContent="stretch">
      <Grid item xs>
        {error ? (
          <TextField
            className={classes.textField}
            disabled
            InputLabelProps={{ shrink: true }}
            label="Source"
            value={error}
          />
        ) : (
          sources && (
            <Autocomplete
              id="entity"
              fullWidth
              options={sources}
              getOptionLabel={(option: Option): string => option.label}
              value={source}
              onChange={handleChange}
              renderInput={(params): ReactElement => (
                <TextField {...params} label="Source" />
              )}
            />
          )
        )}
      </Grid>
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="Height"
          placeholder="auto"
          value={props.card.height}
          onChange={props.handleChange && props.handleChange('height')}
        />
      </Grid>
    </Grid>
  );
}

export default News;

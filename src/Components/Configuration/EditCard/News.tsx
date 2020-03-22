import React, { useEffect, useState, ReactElement } from 'react';
import request from 'superagent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import { SuggestionType } from '../../Utils/Select';
import properCase from '../../../utils/properCase';
import Select from '../../Utils/Select';

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
  const [sources, setSources] = useState<SuggestionType[]>();
  const [error, setError] = useState<string>();
  const classes = useStyles();

  useEffect(() => {
    if (props.config.news && props.config.news.news_api_key) {
      setError(undefined);
      request
        .get(
          `https://newsapi.org/v2/sources?apiKey=${props.config.news.news_api_key}`
        )
        .then((res) => {
          const options: SuggestionType[] = res.body.sources.map(
            (source: FeedSource) => ({
              label: `${source.name} - ${properCase(source.category)} - ${
                source.url
              }`,
              value: source.id,
            })
          );
          setSources(options);
        })
        .catch((err) => {
          console.error(err);
          setError('An error occured when getting the sources for News API.');
        });
    } else
      setError(
        'Invalid config or you do not have a News API key set in your config.'
      );
  }, [props.config.news]);

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
            <Select
              label="Source"
              options={sources}
              value={String(props.card.url)}
              handleChange={(value: string | number): void =>
                props.handleManualChange &&
                props.handleManualChange('url', value)
              }
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

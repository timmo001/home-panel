// @flow
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import { SuggestionType } from '../../Utils/Select';
import properCase from '../../Utils/properCase';
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

const useStyles = makeStyles((_theme: Theme) => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface FeedProps extends BaseProps {}

function Feed(props: FeedProps) {
  const [sources, setSources] = useState();
  const [error, setError] = useState();
  const classes = useStyles();

  useEffect(() => {
    if (props.config.feed.news_api_key)
      request
        .get(
          `https://newsapi.org/v2/sources?apiKey=${props.config.feed.news_api_key}`
        )
        .then(res => {
          const options: SuggestionType = res.body.sources.map(
            (source: FeedSource) => ({
              label: `${source.name} - ${properCase(source.category)} - ${
                source.url
              }`,
              value: source.id
            })
          );
          setSources(options);
        })
        .catch(err => {
          console.error(err);
          setError('An error occured when getting the sources for News API.');
        });
    else setError('You do not have a News API key set in your config.');
  }, [props.config.feed.news_api_key]);

  return (
    <Grid container direction="row" justify="center" alignContent="stretch">
      <Grid item xs>
        {error ? (
          <TextField
            className={classes.textField}
            disabled
            InputLabelProps={{ shrink: true }}
            label="Source"
            color="error"
            value={error}
          />
        ) : (
          <Select
            label="Source"
            options={sources}
            value={String(props.card.url)}
            handleChange={props.handleChange!('url')}
          />
        )}
      </Grid>
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="Height"
          placeholder="auto"
          value={props.card.height}
          onChange={props.handleChange!('height')}
        />
      </Grid>
    </Grid>
  );
}

Feed.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Feed;

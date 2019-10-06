// @flow
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { BaseProps } from './Base';
import MarkdownText from 'Components/Utils/MarkdownText';
import { CardMedia } from '@material-ui/core';

type ArticleData = {
  source: string;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

type FeedData = {
  heading: string;
  meta?: string;
  imageURL?: string;
  content?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflowY: 'auto'
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

interface FeedProps extends BaseProps {}

function Feed(props: FeedProps) {
  const [data, setData] = useState();
  const [error, setError] = useState();

  const classes = useStyles();

  useEffect(() => {
    if (props.config.feed.news_api_key)
      request
        .get(
          `https://newsapi.org/v2/top-headlines?sources=${props.card.url}&apiKey=${props.config.feed.news_api_key}`
        )
        .then(res => {
          const feed: ArticleData = res.body.articles.map(
            (article: ArticleData) => ({
              heading: `[${article.title}](${article.url})`,
              meta: `${moment(article.publishedAt).format(
                `${props.config.header.time_military ? 'HH:mm' : 'hh:mm a'} ${
                  props.config.header.date_format
                }`
              )} - ${article.author}`,
              imageURL: article.urlToImage,
              content: article.description
            })
          );
          setData(feed);
          props.card.disabled = false;
        })
        .catch(err => {
          console.error(err);
          setError('An error occured when getting the sources for News API.');
          props.card.disabled = true;
        });
    else {
      setError('You do not have a News API key set in your config.');
      props.card.disabled = true;
    }
  }, [
    props.config.feed.news_api_key,
    props.card.disabled,
    props.card.url,
    props.config.header.date_format,
    props.config.header.time_military
  ]);

  return (
    <div className={classes.root}>
      {error ? (
        <Typography variant="subtitle1" component="h3">
          {error}
        </Typography>
      ) : (
        data &&
        data.map((item: FeedData, key: number) => (
          <article key={key}>
            {item.imageURL && <CardMedia image={item.imageURL} />}
            <div>
              <Typography variant="subtitle1" component="h3">
                <MarkdownText text={item.heading} />
              </Typography>
              {item.meta && (
                <Typography
                  variant="caption"
                  component="h5"
                  gutterBottom
                  noWrap>
                  <MarkdownText text={item.meta} />
                </Typography>
              )}
              {item.content && (
                <Typography variant="body2" component="span">
                  <MarkdownText text={item.content} />
                </Typography>
              )}
            </div>
            {key !== data.length && (
              <Divider className={classes.divider} light variant="middle" />
            )}
          </article>
        ))
      )}
    </div>
  );
}

Feed.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Feed;

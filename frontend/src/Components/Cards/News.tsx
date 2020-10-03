import React, { useState, useEffect, useCallback, ReactElement } from "react";
import request from "superagent";
import moment from "moment";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";

import { BaseProps } from "./Base";

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
  title: string;
  url: string;
  meta?: string;
  imageURL?: string;
  content?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    overflowY: "auto",
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  mediaContainer: {
    marginRight: theme.spacing(1),
  },
  media: {
    height: `calc(100% - ${theme.spacing(2)}px)`,
    width: "100%",
  },
}));

let feedInterval: NodeJS.Timeout;
function News(props: BaseProps): ReactElement {
  const [data, setData] = useState<FeedData[]>();
  const [error, setError] = useState<string>();

  const classes = useStyles();

  const handleGetData = useCallback(() => {
    if (props.config.news && props.config.news.news_api_key && props.card.url) {
      setError(undefined);
      console.log("Update News Feed for", props.card.url);
      request
        .get(
          `https://newsapi.org/v2/top-headlines?sources=${props.card.url}&apiKey=${props.config.news.news_api_key}`
        )
        .then((res) => {
          const feed: FeedData[] = res.body.articles.map(
            (article: ArticleData) => ({
              heading: `[${article.title}](${article.url})`,
              title: article.title,
              url: article.url,
              meta: `${moment(article.publishedAt).format(
                `${props.config.header.time_military ? "HH:mm" : "hh:mm a"} ${
                  props.config.header.date_format
                }`
              )} - ${article.author}`,
              imageURL: article.urlToImage,
              content: article.description,
            })
          );
          setData(feed);
          props.card.disabled = false;
        })
        .catch((err) => {
          console.error(err);
          setError("An error occured when getting the sources for News API.");
          props.card.disabled = true;
        });
    } else {
      setError(
        "You have not selected a source or do not  a News API key set in your config."
      );
      props.card.disabled = true;
    }
  }, [
    props.config.news,
    props.card.disabled,
    props.card.url,
    props.config.header.date_format,
    props.config.header.time_military,
  ]);

  useEffect(() => {
    handleGetData();
    if (feedInterval) clearInterval(feedInterval);
    feedInterval = setInterval(() => handleGetData, 120000);
    return (): void => {
      if (feedInterval) clearInterval(feedInterval);
    };
  }, [props.card.disabled, handleGetData]);

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
            <Grid
              container
              direction="row"
              justify="center"
              alignContent="center"
              alignItems="center">
              {props.card.width && props.card.width > 2 && item.imageURL && (
                <Grid className={classes.mediaContainer} item xs={3}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <img
                      className={classes.media}
                      alt={item.title}
                      src={item.imageURL}
                    />
                  </a>
                </Grid>
              )}
              <Grid item xs>
                <Typography variant="subtitle1" component="h3">
                  <ReactMarkdown source={item.heading} escapeHtml={false} />
                </Typography>
                {item.meta && (
                  <Typography
                    variant="caption"
                    component="h5"
                    gutterBottom
                    noWrap>
                    <ReactMarkdown source={item.meta} escapeHtml={false} />
                  </Typography>
                )}
                {item.content && (
                  <Typography variant="body2" component="span">
                    <ReactMarkdown source={item.content} escapeHtml={false} />
                  </Typography>
                )}
              </Grid>
            </Grid>
            {key !== data.length - 1 && (
              <Divider className={classes.divider} light variant="middle" />
            )}
          </article>
        ))
      )}
    </div>
  );
}

export default News;

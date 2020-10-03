import React, { useState, useEffect, useCallback, ReactElement } from "react";
import Parser from "rss-parser";
import moment from "moment";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";

import { BaseProps } from "./Base";

type RSSData = {
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  link?: string;
  pubDate?: string;
  title?: string;
};

type FeedData = {
  heading: string;
  title: string;
  url: string;
  meta?: string;
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
function RSS(props: BaseProps): ReactElement {
  const [data, setData] = useState<FeedData[]>();
  const [error, setError] = useState<string>();

  const classes = useStyles();

  const handleGetData = useCallback(async (): Promise<void> => {
    if (props.card.url) {
      setError(undefined);
      console.log("Update RSS Feed for", props.card.url);
      const parser = new Parser();
      const rss = await parser.parseURL(props.card.url);

      if (rss && rss.items) {
        const feed: FeedData[] = rss.items.map((item: RSSData) => ({
          heading: `[${item.title}](${item.link})`,
          title: item.title || "",
          url: item.link || "",
          meta: moment(item.pubDate).format(
            `${props.config.header.time_military ? "HH:mm" : "hh:mm a"} ${
              props.config.header.date_format
            }`
          ),
          content: item.content || "",
        }));
        setData(feed);
        props.card.disabled = false;
      } else {
        setError("There was an error getting the feed.");
        props.card.disabled = true;
      }
    } else {
      setError("You do not have a URL set.");
      props.card.disabled = true;
    }
  }, [
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

export default RSS;

import React, { ReactElement, Fragment, useEffect, useState } from "react";
import request from "superagent";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import type { BaseProps } from "./Base";
import type { Option } from "../../Types/Types";
import properCase from "../../../utils/properCase";

type FeedSource = {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  textField: {
    width: "calc(100% - 8px)",
    margin: 4,
  },
}));

function News(props: BaseProps): ReactElement {
  const [sources, setSources] = useState<Option[]>();
  const [source, setSource] = useState<Option | null>(null);
  const [error, setError] = useState<string>();

  function handleChange(
    _event: React.ChangeEvent<unknown>,
    newValue: Option | null
  ): void {
    setSource(newValue);
    props.handleManualChange?.("url", newValue?.value);
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
          setError("An error occured when getting the sources for News API.");
        });
    } else
      setError(
        "Invalid config or you do not have a News API key set in your config."
      );
  }, [props.config.news, props.card.url]);

  const classes = useStyles();
  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography
          className={classes.heading}
          variant="subtitle1"
          gutterBottom>
          News Configuration
        </Typography>
        <Divider variant="fullWidth" />
      </Grid>
      <Grid
        className={classes.container}
        container
        direction="row"
        justify="center"
        alignItems="flex-end"
        alignContent="flex-end"
        item
        xs>
        <Grid item xs>
          {error ? (
            <TextField
              className={classes.textField}
              disabled
              InputLabelProps={{ shrink: true }}
              label="Source"
              value={error || ""}
            />
          ) : (
            sources && (
              <Autocomplete
                id="entity"
                fullWidth
                options={sources}
                getOptionLabel={(option: Option): string => option.label}
                getOptionSelected={(option: Option): boolean =>
                  option.value === source?.value
                }
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
            value={props.card.height || "auto"}
            onChange={props.handleChange && props.handleChange("height")}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default News;

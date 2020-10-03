import React, { ReactElement } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";

import { BaseProps } from "./Base";

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    margin: theme.spacing(0, 0.25),
    "&a": {
      color: theme.palette.text.secondary,
      "&:visited": {
        color: theme.palette.text.secondary,
      },
      "&:hover": {
        color: theme.palette.text.secondary,
      },
    },
  },
}));

function Markdown(props: BaseProps): ReactElement | null {
  const classes = useStyles();

  if (!props.card.content) return null;
  return (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="body1"
      component="span">
      <ReactMarkdown source={props.card.content} escapeHtml={false} />
    </Typography>
  );
}

export default Markdown;

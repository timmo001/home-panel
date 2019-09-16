// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import Item from './Item';
import MarkdownText from '../Utils/MarkdownText';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2),
    fontSize: 24
  },
  item: {
    padding: theme.spacing(1.5, 1),
    borderBottom: '1px solid #EEE',
    '&:first-child': {
      paddingTop: 0
    },
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  }
}));

interface SectionProps extends ConfigurationProps, HomeAssistantEntityProps {}

function Section(props: SectionProps) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      alignContent="center"
      justify="space-between">
      {props.section.items.map((item: any, key: number) => {
        if (props.section.type === 'array') item.name = Number(key);
        return (
          <Grid
            key={key}
            item
            container
            direction="row"
            alignContent="center"
            justify="space-between"
            className={classes.item}>
            <Grid
              item
              xs
              container
              direction="row"
              alignContent="center"
              justify="space-between">
              {item.icon && (
                <Grid item>
                  <span
                    className={classnames('mdi', item.icon, classes.icon)}
                  />
                </Grid>
              )}
              {item.title && item.description && (
                <Grid item xs>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" component="span">
                    <MarkdownText text={item.description} />
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Item
                  {...props}
                  item={item}
                  path={[...props.path!, item.name]}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

Section.propTypes = {
  config: PropTypes.any,
  path: PropTypes.array.isRequired,
  section: PropTypes.any.isRequired,
  handleUpdateConfig: PropTypes.func.isRequired
};

export default Section;

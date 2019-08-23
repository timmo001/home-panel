// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import Item from './Item';
import MarkdownText from '../Utils/MarkdownText';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  },
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
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  },
  textField: {
    maxWidth: 100
  }
}));

interface SectionProps extends ConfigurationProps, HomeAssistantEntityProps {}

function Section(props: SectionProps) {
  const classes = useStyles();

  console.log('Section:', props.path, props.section);

  return (
    <div>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between">
        {props.section.items.map((item: any, key: number) => {
          if (props.section.type === 'array') item.name = Number(key);
          return (
            <Grid
              key={key}
              item
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              className={classes.item}>
              <Grid
                item
                xs
                container
                direction="row"
                alignItems="center"
                justify="space-between">
                {props.section.type !== 'array' && (
                  <Grid item>
                    <span
                      className={classnames('mdi', item.icon, classes.icon)}
                    />
                  </Grid>
                )}
                {props.section.type !== 'array' && (
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
      {props.section.type === 'array' && (
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="Add"
          onClick={props.handleAdd!(
            [
              ...props.path!,
              Array.isArray(props.section.items)
                ? props.section.items.length
                : 0
            ],
            props.section.default[0]
          )}>
          <AddIcon />
        </Fab>
      )}
    </div>
  );
}

Section.propTypes = {
  config: PropTypes.any,
  path: PropTypes.array.isRequired,
  section: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired
};

export default Section;

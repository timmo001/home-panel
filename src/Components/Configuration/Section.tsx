// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConfigurationProps } from './Configuration';
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
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  },
  textField: {
    maxWidth: 100
  }
}));

interface SectionProps extends ConfigurationProps {}

function Section(props: SectionProps) {
  const classes = useStyles();

  return props.section.items.map((item: any) => (
    <Grid
      key={item.name}
      container
      direction="row"
      alignItems="center"
      className={classes.item}>
      <Grid item>
        <span className={classnames('mdi', item.icon, classes.icon)} />
      </Grid>
      <Grid item xs>
        <Typography variant="subtitle1">{item.title}</Typography>
        <Typography variant="body2" component="span">
          <MarkdownText text={item.description} />
        </Typography>
      </Grid>
      <Grid item>
        <Item
          {...props}
          item={item}
          path={[...props.path!, item.name]}
        />
      </Grid>
    </Grid>
  ));
}

Section.propTypes = {
  config: PropTypes.any,
  path: PropTypes.array.isRequired,
  section: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired
};

export default Section;

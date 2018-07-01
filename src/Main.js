import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  grid: {
    padding: theme.spacing.unit * 2,
  },
  header: {
    textAlign: 'center',
  },
  time: {
    color: grey[100],
    fontSize: '6rem',
  },
  timePeriod: {
    marginLeft: theme.spacing.unit * 2,
    fontSize: '3rem',
  },
  date: {
    color: grey[100],
    marginTop: theme.spacing.unit * -2.5,
  },
  card: {
    minHeight: '10rem',
    maxHeight: '10rem',
    maxWidth: '10rem',
  },
  name: {
    fontSize: '1.2rem',
  },
});

const items = [
  {
    name: 'Living Room',
    cards: [
      {
        name: 'Setee Light',
        entity_id: 'light.setee_light',
      },
    ]
  },
];

class Navigation extends React.Component {

  render() {
    const { classes, entities, handleChange } = this.props;

    return (
      <div>
        <Grid
          container
          justify="center"
          className={classes.header}
          spacing={16}>
          <Grid item zeroMinWidth>
            <Typography className={classes.time} variant="display4">
              <Moment format="hh:mm" />
              <Moment className={classes.timePeriod} format="a" />
            </Typography>
            <Typography className={classes.date} variant="display2">
              <Moment format="Do MMMM YYYY" />
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.grid}
          spacing={16}>
          {items && items.map(group => {
            return (
              <Grid key={group.name} item zeroMinWidth>
                <Typography className={classes.title} variant="display1" gutterBottom>
                  {group.name}
                </Typography>
                {group.cards.map(card => {
                  return (
                    <Grid key={card.name} item zeroMinWidth>
                      <Card className={classes.card} elevation={1}>
                        <CardContent>
                          <Typography className={classes.name} variant="headline" noWrap>
                            {card.name}
                          </Typography>
                          {/* <Typography className={classes.state} noWrap>
                            {console.log(entities[entities.indexOf(entity => { return entity[0] === card.entity_id })])}
                          </Typography> */}
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            )
          })}
        </Grid>
      </div>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Navigation);

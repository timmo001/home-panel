import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { getCardElevation, getSquareCards } from "../../Common/config";
import grid from "../../Common/Style/grid";
import card from "../../Common/Style/card";

const styles = theme => ({
  ...grid(theme),
  ...card(theme)
});

class Link extends React.PureComponent {
  render() {
    const {
      classes,
      config,
      card,
      editing,
      handleCardEdit,
      groupId,
      cardId
    } = this.props;
    const { name, url } = card;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    const icon = card.icon && card.icon;

    return (
      <Grid
        className={classes.cardContainer}
        style={{
          "--width": card.width ? card.width : 1,
          "--height": card.height ? card.height : 1
        }}
        item>
        <ButtonBase
          className={classes.cardOuter}
          focusRipple
          onClick={() => editing && handleCardEdit(groupId, cardId, card)}
          href={!editing ? url : null}
          target="_blank">
          <Card
            className={classes.card}
            elevation={cardElevation}
            square={squareCards}>
            <CardContent
              className={classes.cardContent}
              style={{
                "--height": card.height
                  ? typeof card.height === "number"
                    ? `${98 * card.height}px`
                    : card.height
                  : "98px"
              }}>
              <Typography className={classes.name} variant="h5">
                {name}
              </Typography>
              {icon && (
                <span
                  className={classnames("mdi", `mdi-${icon}`, classes.icon)}
                />
              )}
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid>
    );
  }
}

Link.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired
};

export default withStyles(styles)(Link);

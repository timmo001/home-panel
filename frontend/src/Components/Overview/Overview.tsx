import React, { useEffect, useCallback, ReactElement, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { CommandType } from "../Utils/Command";
import { ConfigProps, GroupProps, CardProps } from "../Configuration/Config";
import { HomeAssistantChangeProps } from "../HomeAssistant/HomeAssistant";
import Groups from "../Groups/Groups";
import Header from "./Header";
import Pages from "./Pages";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: "100%",
    minHeight: "100%",
    maxHeight: "100%",
    overflow: "hidden",
    paddingBottom: theme.spacing(6.5),
  },
  groupsContainer: {
    marginBottom: theme.spacing(0.5),
    overflowX: "auto",
    overflowY: "hidden",
  },
}));

export interface OverviewProps extends ConfigProps, HomeAssistantChangeProps {
  command: CommandType;
  mouseMoved: boolean;
}

function Overview(props: OverviewProps): ReactElement {
  const [currentPage, setCurrentPage] = useState<string>(
    props.config.pages[0].key
  );

  const handleSetCurrentPage = useCallback(
    (page: string) => {
      if (page !== currentPage) setCurrentPage(page);
    },
    [currentPage]
  );

  useEffect(() => {
    if (props.command) {
      if (props.command.page) handleSetCurrentPage(props.command.page);
      else if (props.command.card) {
        const foundCard: CardProps | undefined = props.config.cards.find(
          (card: CardProps) => card.key === props.command?.card
        );
        if (foundCard) {
          const foundGroup: GroupProps | undefined = props.config.groups.find(
            (group: GroupProps) => group.key === foundCard.group
          );
          if (foundGroup) handleSetCurrentPage(foundGroup.page);
        }
      }
    }
  }, [
    props.command,
    props.config.cards,
    props.config.groups,
    handleSetCurrentPage,
  ]);

  const classes = useStyles();

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      justify="flex-start"
      alignContent="flex-start">
      <Header {...props} />
      <Grid
        className={classes.groupsContainer}
        item
        xs
        container
        direction="column"
        justify="flex-start"
        alignContent="flex-start"
        spacing={1}>
        <Groups {...props} currentPage={currentPage} />
      </Grid>
      <Pages
        {...props}
        currentPage={currentPage}
        setPage={handleSetCurrentPage}
      />
    </Grid>
  );
}

export default Overview;

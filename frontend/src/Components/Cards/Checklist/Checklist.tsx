import React, { Fragment, ReactElement, useCallback, useMemo } from "react";
import { arrayMoveMutable } from "array-move";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

import { BaseProps } from "../Base";
import { ChecklistItem } from "../../Configuration/Config";
import clone from "../../../utils/clone";
import Item from "./Item";
import makeKey from "../../../utils/makeKey";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    overflowY: "auto",
  },
  button: {
    width: "100%",
  },
  inputChecked: {
    textDecoration: "line-through",
  },
}));

function Checklist(props: BaseProps): ReactElement | null {
  const handleDeleteItem = useCallback(
    (key: number) => () => {
      const items = props.card.checklist_items || [];
      items.splice(key, 1);
      props.handleUpdate({ ...props.card, checklist_items: items });
    },
    [props]
  );

  const handleMoveItem = useCallback(
    (key: number) => (amount: number) => {
      const items = clone(props.card.checklist_items) || [];
      arrayMoveMutable(items, key, key + amount),
        props.handleUpdate({
          ...props.card,
          checklist_items: items,
        });
    },
    [props]
  );

  const handleUpdateItem = useCallback(
    (key: number) => (item: ChecklistItem) => {
      const items = props.card.checklist_items || [];
      items[key] = item;
      props.handleUpdate({ ...props.card, checklist_items: items });
    },
    [props]
  );

  const handleAddItem = useCallback(() => {
    const items = props.card.checklist_items || [];
    items.push({ key: makeKey(32), text: "", checked: false });
    props.handleUpdate({ ...props.card, checklist_items: items });
  }, [props]);

  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justifyContent="center"
      alignContent="flex-start"
      alignItems="center"
    >
      {useMemo(() => {
        if (
          props.card.checklist_items !== undefined &&
          Array.isArray(props.card.checklist_items)
        ) {
          const itemLength = props.card.checklist_items.length - 1;
          return props.card.checklist_items.map(
            (item: ChecklistItem, key: number) => (
              <Fragment key={key}>
                <Item
                  item={item}
                  maxPosition={itemLength}
                  position={key}
                  handleDeleteItem={handleDeleteItem(key)}
                  handleMoveItem={handleMoveItem(key)}
                  handleUpdateItem={handleUpdateItem(key)}
                />
                {key !== itemLength && (
                  <Grid item xs={12}>
                    <Divider light variant="middle" />
                  </Grid>
                )}
              </Fragment>
            )
          );
        }
      }, [
        props.card.checklist_items,
        handleDeleteItem,
        handleMoveItem,
        handleUpdateItem,
      ])}
      <Grid item xs={12}>
        <Button className={classes.button} onClick={handleAddItem}>
          <AddIcon />
        </Button>
      </Grid>
    </Grid>
  );
}

export default Checklist;

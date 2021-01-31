import React, {
  ChangeEvent,
  Fragment,
  ReactElement,
  useCallback,
  useState,
  useEffect,
} from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { ChecklistItem } from "../../Configuration/Config";

const useStyles = makeStyles(() => ({
  input: {
    padding: 0,
  },
  inputChecked: {
    textDecoration: "line-through",
  },
}));

interface ItemProps {
  item: ChecklistItem;
  maxPosition: number;
  position: number;
  handleDeleteItem: () => void;
  handleMoveItem: (amount: number) => void;
  handleUpdateItem: (item: ChecklistItem) => void;
}

let updateTimeout: NodeJS.Timeout;
function Checklist(props: ItemProps): ReactElement | null {
  const [item, setItem] = useState<ChecklistItem>(props.item);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleDeleteItem(): void {
    handleCloseMenu();
    props.handleDeleteItem();
  }

  function handleMoveUp(): void {
    handleCloseMenu();
    props.handleMoveItem(-1);
  }

  function handleMoveDown(): void {
    handleCloseMenu();
    props.handleMoveItem(+1);
  }

  const handleUpdateItem = useCallback(
    async (newItem: ChecklistItem) => {
      setItem(newItem);
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => props.handleUpdateItem(newItem), 100);
    },
    [props]
  );

  const handleCheckedChange = useCallback(
    async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      handleUpdateItem({ ...item, checked: checked });
    },
    [item, handleUpdateItem]
  );

  const handleTextChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      handleUpdateItem({ ...item, text: event.target.value });
    },
    [item, handleUpdateItem]
  );

  useEffect(() => {
    if (props.item.key !== item.key) setItem(props.item);
  }, [props.item, item]);

  const classes = useStyles();
  return (
    <Fragment>
      <Grid
        component="form"
        item
        xs={12}
        container
        direction="row"
        justify="center"
        alignContent="flex-start"
        alignItems="center">
        <Grid item>
          <Checkbox
            checked={item.checked}
            inputProps={{ "aria-label": "checked" }}
            onChange={handleCheckedChange}
          />
        </Grid>
        <Grid item xs>
          <InputBase
            className={clsx(
              classes.input,
              item.checked && classes.inputChecked
            )}
            disabled={item.checked}
            inputProps={{ "aria-label": "text" }}
            multiline
            value={item.text}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            minWidth: "20ch",
          },
        }}>
        {props.position > 0 && (
          <MenuItem onClick={handleMoveUp}>Move Up</MenuItem>
        )}
        {props.position < props.maxPosition && (
          <MenuItem onClick={handleMoveDown}>Move Down</MenuItem>
        )}
        <MenuItem onClick={handleDeleteItem}>Delete</MenuItem>
      </Menu>
    </Fragment>
  );
}

export default Checklist;

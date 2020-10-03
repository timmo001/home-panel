import React, { Fragment, ReactElement, useState } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Typography from "@material-ui/core/Typography";

import { ConfigProps, defaultPage, Page } from "../Configuration/Config";
import { findPageIdByPage } from "../../utils/find";
import EditPage from "../Configuration/EditPage";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    fontSize: "1.1rem",
  },
}));

let editTimeout: NodeJS.Timeout;
interface PagesProps extends ConfigProps {
  currentPage: string;
  mouseMoved: boolean;
  setPage: (pageKey: string) => void;
}

function Pages(props: PagesProps): ReactElement {
  const [editingPage, setEditingPage] = useState<Page>();

  function handlePageChange(
    _event: React.ChangeEvent<unknown>,
    pageKey: string
  ): void {
    props.setPage(pageKey);
  }

  function handleAdd(): void {
    const newPage = defaultPage();
    props.handleUpdateConfig(["pages", props.config.pages.length], newPage);
    props.setPage(newPage.key);
  }

  const handleEditingPage = (page: Page) => (): void => {
    if (props.editing === 1)
      editTimeout = setTimeout(() => setEditingPage(page), 1000);
  };

  function handleCancelEdit(): void {
    clearTimeout(editTimeout);
  }

  function handleDoneEditingPage(): void {
    setEditingPage(undefined);
  }

  const handleUpdatePage = (page: Page) => (data?: Page): void => {
    props.handleUpdateConfig(
      ["pages", findPageIdByPage(props.config, page)],
      data
    );
    props.setPage(props.config.pages[0].key);
  };

  const handleMovePage = (page: Page) => (position: number): void => {
    props.handleUpdateConfig(
      ["pages", findPageIdByPage(props.config, page)],
      [position]
    );
    props.setPage(props.config.pages[findPageIdByPage(props.config, page)].key);
  };

  const classes = useStyles();
  return (
    <Fragment>
      <BottomNavigation
        className={classes.root}
        value={props.currentPage}
        onChange={handlePageChange}
        showLabels>
        {props.config &&
          props.config.pages.map((page: Page, key: number) => (
            <BottomNavigationAction
              key={key}
              value={page.key}
              label={page.name}
              onTouchStart={handleEditingPage(page)}
              onMouseDown={handleEditingPage(page)}
              onTouchCancel={handleCancelEdit}
              onTouchEnd={handleCancelEdit}
              onMouseUp={handleCancelEdit}
              onMouseLeave={handleCancelEdit}
              icon={
                <Typography
                  className={clsx("mdi", `mdi-${page.icon}`, classes.icon)}
                  variant="h4"
                  component="h5"
                />
              }
            />
          ))}
        {props.editing === 1 && (
          <BottomNavigationAction
            onClick={handleAdd}
            icon={
              <Typography
                className={clsx("mdi", "mdi-plus", classes.icon)}
                variant="h4"
                component="h5"
              />
            }
          />
        )}
      </BottomNavigation>
      {editingPage && (
        <EditPage
          {...props}
          page={editingPage}
          handleClose={handleDoneEditingPage}
          handleMove={handleMovePage(editingPage)}
          handleUpdate={handleUpdatePage(editingPage)}
        />
      )}
    </Fragment>
  );
}

export default Pages;

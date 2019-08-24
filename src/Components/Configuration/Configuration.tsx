// @flow
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import { items, ConfigProps } from './Config';
import Section from './Section';

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '&:last-child': { marginBottom: 0 }
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: theme.spacing(2.5)
    }
  },
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  }
}));

export interface ConfigurationProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantEntityProps {
  path?: any[];
  item?: any;
  section?: any;
  handleAdd?: (path: any[], defaultItem: any) => () => void;
  handleDelete?: (path: any[]) => () => void;
  handleChange?: (
    path: any[],
    type: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRadioChange?: (
    path: any[]
  ) => (event: React.ChangeEvent<unknown>) => void;
  handleSwitchChange?: (
    path: any[]
  ) => (_event: React.ChangeEvent<{}>, checked: boolean) => void;
  handleSelectChange?: (
    path: any[]
  ) => (event: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  handleSetSections?: (
    path: any[],
    section: any | any[]
  ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Configuration(props: ConfigurationProps) {
  const [path, setPath]: any[] = React.useState([]);
  const [sections, setSections]: any[] = React.useState(items);

  useEffect(() => {
    if (!props.back) {
      setPath([]);
      setSections(items);
    }
  }, [props.back]);

  const handleAdd = (path: any[], defaultItem: any) => () => {
    props.handleUpdateConfig!(path, defaultItem);
  };

  const handleDelete = (path: any[]) => () => {
    props.handleUpdateConfig!(path, undefined);
  };

  const handleChange = (path: any[], type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.handleUpdateConfig!(
      path,
      type === 'number' ? Number(event.target.value) : event.target.value
    );
  };

  const handleRadioChange = (path: any[]) => (
    event: React.ChangeEvent<unknown>
  ) => {
    props.handleUpdateConfig!(
      path,
      Number((event.target as HTMLInputElement).value)
    );
  };

  const handleSwitchChange = (path: any[]) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ) => {
    props.handleUpdateConfig!(path, checked);
  };

  const handleSelectChange = (path: any[]) => (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    props.handleUpdateConfig!(path, event.target.value);
  };

  const handleSetSections = (path: any[], section: any | any[]) => (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setPath(path);
    setSections(Array.isArray(section) ? section : [section]);
    if (path !== []) props.handleSetBack!(true);
  };

  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={1}>
      {sections.map((item: any, key: number) => (
        <Grid
          className={classes.section}
          key={key}
          container
          direction="column"
          item
          lg={4}
          md={8}
          sm={10}
          xs={12}>
          <Grid item xs container>
            {item.title && (
              <Grid item xs>
                <Typography variant="h4" gutterBottom noWrap>
                  {item.title}
                </Typography>
              </Grid>
            )}
            {item.type === 'object' && (
              <Grid item>
                <IconButton
                  color="secondary"
                  onClick={handleDelete([...path, item.name])}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent className={classes.cardContent}>
                <Section
                  {...props}
                  path={[...path, item.name]}
                  section={item}
                  handleAdd={handleAdd}
                  handleChange={handleChange}
                  handleDelete={handleDelete}
                  handleRadioChange={handleRadioChange}
                  handleSelectChange={handleSelectChange}
                  handleSetSections={handleSetSections}
                  handleSwitchChange={handleSwitchChange}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
      {sections[0].type === 'object' && (
        <Fab
          className={classes.fab}
          color="primary"
          aria-label="Add"
          onClick={handleAdd(
            [...path, sections.length],
            sections[0].default[0]
          )}>
          <AddIcon />
        </Fab>
      )}
    </Grid>
  );
}

Configuration.propTypes = {
  config: PropTypes.any,
  back: PropTypes.bool.isRequired,
  handleUpdateConfig: PropTypes.func.isRequired,
  handleSetBack: PropTypes.func.isRequired
};

export default Configuration;

import React, { useEffect, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import { items, ConfigProps, SectionProps, ItemProps } from './Config';
import clone from '../../utils/clone';
import makeKey from '../../utils/makeKey';
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
  path: (string | number)[];
  item: ItemProps;
  section: SectionProps;
  handleBackupConfig: () => void;
  handleRestoreConfig: () => void;
  handleAdd: (path: (string | number)[], defaultItem: any) => () => void;
  handleDelete: (path: (string | number)[]) => () => void;
  handleSetSections: (
    path: (string | number)[],
    section: SectionProps | SectionProps[]
  ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Configuration(props: ConfigurationProps): ReactElement {
  const [path, setPath] = React.useState<(string | number)[]>([]);
  const [sections, setSections] = React.useState<SectionProps[]>(items);

  useEffect(() => {
    if (!props.back) {
      setPath([]);
      setSections(items);
    }
  }, [props.back]);

  const handleAdd = (
    path: (string | number)[],
    defaultItem: any
  ) => (): void => {
    if (defaultItem.key) defaultItem.key = makeKey(16);
    props.handleUpdateConfig(path, defaultItem);
    if (path !== []) {
      const newSections: SectionProps[] = [
        ...sections,
        {
          ...sections[0],
          name: sections.length,
          title: defaultItem.name
        }
      ];
      setSections(newSections);
    }
  };

  const handleDelete = (path: any[]) => () => {
    const id = clone(path).pop();
    props.handleUpdateConfig(path, undefined);
    if (path !== []) {
      const newSections = clone(sections);
      newSections.splice(id, 1);
      setSections(newSections);
    }
  };

  const handleSetSections = (
    path: (string | number)[],
    section: SectionProps | SectionProps[]
  ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    setPath(path);
    setSections(Array.isArray(section) ? section : [section]);
    if (path !== []) props.handleSetBack(true);
  };

  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      spacing={1}>
      {sections.map((section: SectionProps, key: number) => (
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
            {section.title && (
              <Grid item xs>
                <Typography variant="h4" gutterBottom noWrap>
                  {section.title}
                </Typography>
              </Grid>
            )}
            {section.type === 'object' && (
              <Grid item>
                <IconButton
                  color="secondary"
                  onClick={handleDelete([...path, section.name])}>
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
                  path={[...path, section.name]}
                  section={section}
                  handleAdd={handleAdd}
                  handleSetSections={handleSetSections}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
      {/* TODO {sections[0].type === 'object' && (
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
      )} */}
    </Grid>
  );
}

export default Configuration;

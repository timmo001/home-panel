import React, { useEffect, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import {
  sections as defaultSections,
  ConfigProps,
  SectionProps,
  SectionItemsProps
} from './Config';
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

interface ConfigurationBaseProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantEntityProps {
  back: boolean;
  handleBackupConfig: () => void;
  handleRestoreConfig: () => void;
  handleSetBack: (back: boolean) => void;
}

export interface ConfigurationProps extends ConfigurationBaseProps {
  path: (string | number)[];
  section: SectionProps;
  handleAdd: (
    path: (string | number)[],
    defaultItem: SectionItemsProps
  ) => () => void;
  handleSetSections: (
    path: (string | number)[],
    section: SectionProps | SectionProps[]
  ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Configuration(props: ConfigurationBaseProps): ReactElement {
  // const [path, setPath] = React.useState<(string | number)[]>([]);
  const [sections, setSections] = React.useState<SectionProps[]>(
    defaultSections
  );

  useEffect(() => {
    if (!props.back) {
      // setPath([]);
      setSections(sections);
    }
  }, [props.back]);

  const handleAdd = (
    path: (string | number)[],
    defaultItem: SectionItemsProps
  ) => (): void => {
    if (defaultItem.key) defaultItem.key = makeKey(16);
    props.handleUpdateConfig(path, defaultItem);
    if (path !== []) {
      const newItems: SectionProps[] = [
        ...sections,
        {
          ...sections[0],
          name: sections.length,
          title: defaultItem.name
        }
      ];
      setSections(newItems);
    }
  };

  const handleSetSections = (
    path: (string | number)[],
    section: SectionProps | SectionProps[]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ) => (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    // setPath(path);
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
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent className={classes.cardContent}>
                <Section
                  {...props}
                  path={[section.name]}
                  section={section}
                  handleAdd={handleAdd}
                  handleSetSections={handleSetSections}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Configuration;

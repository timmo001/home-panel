import React, { ReactElement } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { sections, ConfigProps, ConfigSection } from "./Config";
import Section from "./Section";

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "&:last-child": { marginBottom: 0 },
  },
  cardContent: {
    "&:last-child": {
      paddingBottom: theme.spacing(2.5),
    },
  },
  fab: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

interface ConfigurationBaseProps extends ConfigProps {
  handleBackupConfig: () => void;
  handleRestoreConfig: () => void;
}

export interface ConfigurationProps extends ConfigurationBaseProps {
  path: (string | number)[];
  section: ConfigSection;
}

function Configuration(props: ConfigurationBaseProps): ReactElement {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      spacing={1}>
      {sections.map((section: ConfigSection, key: number) => (
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
                <Section {...props} path={[section.name]} section={section} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Configuration;

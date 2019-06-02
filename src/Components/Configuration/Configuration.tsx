// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { items, ConfigProps } from './Config';

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '&:last-child': { marginBottom: 0 }
  },
  item: {
    borderBottom: '1px solid #EEE',
    '&:last-child': { borderBottom: 'none' }
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

interface ConfigurationProps extends RouteComponentProps, ConfigProps {
  config: any;
  handleUpdateConfig: (path: any[], data: any) => void;
}

function Configuration(props: ConfigurationProps) {
  const handleChange = (path: string[], type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.handleUpdateConfig(
      path,
      type === 'number' ? Number(event.target.value) : event.target.value
    );
  };

  const handleRadioChange = (path: string[]) => (
    event: React.ChangeEvent<unknown>
  ) => {
    props.handleUpdateConfig(path, (event.target as HTMLInputElement).value);
  };

  const handleSwitchChange = (path: string[]) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ) => {
    props.handleUpdateConfig(path, checked);
  };

  // function handleSelectChange(
  //   event: React.ChangeEvent<{ name?: string; value: unknown }>
  // ) {
  //   setCard({ ...card, [event.target.name as string]: event.target.value });
  // }

  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={1}>
      {items.map((section: any) => (
        <Grid
          className={classes.section}
          key={section.name}
          item
          lg={3}
          md={6}
          sm={8}
          xs={12}>
          <Typography variant="h4" gutterBottom noWrap>
            {section.title}
          </Typography>
          <Card>
            <CardContent>
              {section.items.map((item: any) => (
                <Grid
                  key={item.name}
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.item}>
                  <Grid item xs>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </Grid>
                  <Grid item>
                    {item.type === 'input' && (
                      <TextField
                        placeholder={String(item.default)}
                        type={
                          typeof item.default === 'number' ? 'number' : 'text'
                        }
                        defaultValue={props.config[section.name][item.name]}
                        onChange={handleChange(
                          [section.name, item.name],
                          typeof item.default === 'number' ? 'number' : 'string'
                        )}
                      />
                    )}
                    {item.type === 'radio' && (
                      <FormControl component="fieldset">
                        <RadioGroup
                          className={classes.radioGroup}
                          aria-label={item.title}
                          name={item.name}
                          defaultValue={props.config[section.name][item.name]}
                          onChange={handleRadioChange([
                            section.name,
                            item.name
                          ])}>
                          {item.items.map((rItem: any) => (
                            <FormControlLabel
                              key={rItem.name}
                              value={rItem.name}
                              label={rItem.title}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                    {item.type === 'switch' && (
                      <Switch
                        color="primary"
                        defaultChecked={props.config[section.name][item.name]}
                        onChange={handleSwitchChange([section.name, item.name])}
                      />
                    )}
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

Configuration.propTypes = {
  config: PropTypes.any,
  handleUpdateConfig: PropTypes.func.isRequired
};

export default Configuration;

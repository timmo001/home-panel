import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ColorResult } from "react-color";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { ConfigurationProps } from "./Configuration";
import { ConfigSectionItem } from "./Config";
import clone from "../../utils/clone";
import ColorAdornment from "../Utils/ColorAdornment";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 80,
  },
  backupButton: {
    marginRight: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
    fontSize: 24,
  },
  iconButton: {
    fontSize: 22,
    height: 24,
  },
  item: {
    padding: theme.spacing(1.5, 1),
    borderBottom: "1px solid #EEE",
    "&:first-child": {
      paddingTop: 0,
    },
    "&:last-child": {
      borderBottom: "none",
      paddingBottom: 0,
    },
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
  },
}));

interface ItemProps extends ConfigurationProps {
  item: ConfigSectionItem;
}

let updateTimeout: NodeJS.Timeout;
function Item(props: ItemProps): ReactElement {
  const [value, setValue] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setValue(undefined);
  }, [props.section]);

  useEffect(() => {
    if (value === undefined) {
      if (props.path) {
        const lastItem = props.path.pop();
        const secondLastItem = props.path.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (o: any, k: any) => (o[k] = o[k] || {}),
          props.config
        );
        const val =
          lastItem === undefined || secondLastItem[lastItem] === undefined
            ? props.item.default
            : secondLastItem[lastItem];
        setValue(val);
      }
    }
  }, [props.config, props.item.default, props.path, value]);

  const handleClickShowPassword = useCallback((): void => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleMouseDownPassword = useCallback(
    (event: { preventDefault: () => void }): void => {
      event.preventDefault();
    },
    []
  );

  const handleUpdate = useCallback(
    (p: (string | number)[], v: unknown): void => {
      const path = clone(p),
        value = clone(v);
      setValue(value);
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        props.handleUpdateConfig(path, value);
      }, 100);
    },
    [props]
  );

  const handleChange = useCallback(
    (path: (string | number)[], type: string) => (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const val =
        type === "number" ? Number(event.target.value) : event.target.value;
      handleUpdate(path, val);
    },
    [handleUpdate]
  );

  const handleRadioChange = useCallback(
    (path: (string | number)[]) => (
      event: React.ChangeEvent<unknown>
    ): void => {
      const val = Number((event.target as HTMLInputElement).value);
      handleUpdate(path, val);
    },
    [handleUpdate]
  );

  const handleSwitchChange = useCallback(
    (path: (string | number)[]) => (
      _event: React.ChangeEvent<unknown>,
      checked: boolean
    ): void => {
      handleUpdate(path, checked);
    },
    [handleUpdate]
  );

  const handleSelectChange = useCallback(
    (path: (string | number)[]) => (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ): void => {
      handleUpdate(path, event.target.value);
    },
    [handleUpdate]
  );

  const handleColorChange = useCallback(
    (path: (string | number)[]) => (color: ColorResult): void => {
      handleUpdate(path, color.hex);
    },
    [handleUpdate]
  );

  const classes = useStyles();

  return useMemo(() => {
    if (props.item.type !== "backup_restore" && value === undefined)
      return <div />;
    switch (props.item.type) {
      default:
        return <div />;
      case "backup_restore":
        return (
          <Grid container direction="row">
            <Button
              className={classes.backupButton}
              color="primary"
              variant="contained"
              onClick={props.handleBackupConfig}>
              Backup
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={props.handleRestoreConfig}>
              Restore
            </Button>
          </Grid>
        );
      case "color":
        return (
          <TextField
            className={classes.root}
            placeholder={String(props.item.default)}
            type="text"
            InputProps={{
              endAdornment: (
                <ColorAdornment
                  color={value}
                  handleColorChange={handleColorChange(props.path)}
                />
              ),
            }}
            value={value || ""}
            onChange={handleChange(props.path, "color")}
          />
        );
      case "color_only":
        return (
          <ColorAdornment
            color={value}
            handleColorChange={handleColorChange(props.path)}
          />
        );
      case "input":
        return (
          <TextField
            className={classes.root}
            placeholder={String(props.item.default)}
            type={typeof props.item.default === "number" ? "number" : "text"}
            value={value || ""}
            onChange={handleChange(
              props.path,
              typeof props.item.default === "number" ? "number" : "string"
            )}
          />
        );
      case "input_password":
        return (
          <TextField
            className={classes.root}
            type={showPassword ? "text" : "password"}
            placeholder={String(props.item.default)}
            value={value || ""}
            onChange={handleChange(
              props.path,
              typeof props.item.default === "number" ? "number" : "string"
            )}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );
      case "radio":
        return (
          <FormControl component="fieldset">
            <RadioGroup
              className={classes.radioGroup}
              aria-label={props.item.title}
              name={typeof props.item.name === "string" ? props.item.name : ""}
              value={value || ""}
              onChange={handleRadioChange(props.path)}>
              {props.item.items &&
                props.item.items.map(
                  (
                    rItem: string | number | ConfigSectionItem,
                    key: number
                  ): ReactElement | null => {
                    if (typeof rItem !== "string" && typeof rItem !== "number")
                      return null;
                    return (
                      <FormControlLabel
                        key={key}
                        value={key || ""}
                        label={rItem}
                        control={<Radio color="primary" />}
                      />
                    );
                  }
                )}
            </RadioGroup>
          </FormControl>
        );
      case "select":
        return (
          <FormControl>
            <InputLabel htmlFor="theme"></InputLabel>
            <Select
              className={classes.root}
              value={value}
              onChange={handleSelectChange(props.path)}>
              {props.item.items &&
                props.item.items.map(
                  (
                    sItem: string | number | ConfigSectionItem,
                    key: number
                  ): ReactElement | null => {
                    if (typeof sItem !== "string" && typeof sItem !== "number")
                      return null;
                    return (
                      <MenuItem key={key} value={sItem}>
                        {sItem}
                      </MenuItem>
                    );
                  }
                )}
            </Select>
          </FormControl>
        );
      case "switch":
        return (
          <Switch
            color="primary"
            checked={
              value !== undefined && typeof value === "boolean"
                ? Boolean(value)
                : Boolean(props.item.default)
            }
            onChange={handleSwitchChange(props.path)}
          />
        );
    }
  }, [
    classes.backupButton,
    classes.radioGroup,
    classes.root,
    handleChange,
    handleClickShowPassword,
    handleColorChange,
    handleMouseDownPassword,
    handleRadioChange,
    handleSelectChange,
    handleSwitchChange,
    props.handleBackupConfig,
    props.handleRestoreConfig,
    props.item.default,
    props.item.items,
    props.item.name,
    props.item.title,
    props.item.type,
    props.path,
    showPassword,
    value,
  ]);
}

export default Item;

import React, { ReactElement, useEffect, useState } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

import type { HomeAssistantEntityProps } from "../HomeAssistant";
import type { Option } from "../../Types/Types";
import properCase from "../../../utils/properCase";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: "1 1 auto",
    margin: 4,
  },
  menu: {
    zIndex: 2000,
  },
}));

interface EntitySelectProps extends HomeAssistantEntityProps {
  entity?: string;
  handleChange: (value?: string) => void;
}

function EntitySelect(props: EntitySelectProps): ReactElement {
  const classes = useStyles();

  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState<Option | null>(null);

  function handleChange(
    _event: React.ChangeEvent<unknown>,
    newValue: Option | null
  ): void {
    setValue(newValue);
    props.handleChange(newValue?.value);
  }

  useEffect(() => {
    setOptions(
      Object.values(props.hassEntities)
        .filter(
          (entity: HassEntity) => !entity.entity_id.startsWith("device_tracker")
        )
        .sort((a: HassEntity, b: HassEntity) =>
          a.entity_id > b.entity_id ? 1 : a.entity_id < b.entity_id ? -1 : 0
        )
        .map((entity: HassEntity) => ({
          label: entity.attributes.friendly_name
            ? `${entity.attributes.friendly_name} - ${entity.entity_id}`
            : entity.entity_id,
          value: entity.entity_id,
        }))
    );
  }, [props.hassEntities]);

  useEffect(() => {
    if (!value && options && props.entity) {
      const val = options.find(
        (option: Option) => option.value === props.entity
      );
      if (val) setValue(val);
    }
  }, [value, options, props.entity]);

  return (
    <div className={classes.root}>
      <Autocomplete
        id="entity"
        fullWidth
        options={options}
        groupBy={(option: Option): string =>
          properCase(option.value.split(".")[0])
        }
        getOptionLabel={(option: Option): string => option.label}
        getOptionSelected={(option: Option): boolean =>
          option.value === value?.value
        }
        value={value || null}
        onChange={handleChange}
        renderInput={(params): ReactElement => (
          <TextField
            {...params}
            placeholder="Search for entities"
            label="Entity"
          />
        )}
      />
    </div>
  );
}

export default EntitySelect;

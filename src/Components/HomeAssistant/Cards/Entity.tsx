import React from 'react';
import PropTypes from 'prop-types';

import { BaseProps } from '../../Cards/Base';
import AlarmPanel from './AlarmPanel';
import Camera from './Camera';
import Climate from './Climate';
import Cover from './Cover';
import Fan from './Fan';
import Light from './Light';
import Media from './Media';
import Number from './Number';
import Select from './Select';
import State from './State';
import Text from './Text';
import Toggle from './Toggle';
import Weather from './Weather';

export interface EntityProps extends BaseProps {
  handleHassToggle: () => void;
}

function Entity(props: EntityProps) {
  const domain = props.card.entity && props.card.entity.split('.')[0].trim();
  props.card.domain = domain;
  if (!props.card.entity) return null;

  if (
    domain === 'air_quality' ||
    domain === 'binary_sensor' ||
    domain === 'device_tracker' ||
    domain === 'geo_location' ||
    domain === 'person' ||
    domain === 'sensor' ||
    domain === 'sun'
  )
    return <State {...props} />;

  if (
    domain === 'group' ||
    domain === 'input_boolean' ||
    domain === 'lock' ||
    domain === 'remote' ||
    domain === 'scene' ||
    domain === 'script' ||
    domain === 'switch'
  )
    return <Toggle {...props} />;
  if (domain === 'alarm_control_panel') return <AlarmPanel {...props} />;
  if (domain === 'camera') return <Camera {...props} />;
  if (domain === 'climate') return <Climate {...props} />;
  if (domain === 'cover') return <Cover {...props} />;
  if (domain === 'fan') return <Fan {...props} />;
  if (domain === 'input_number') return <Number {...props} />;
  if (domain === 'input_select') return <Select {...props} />;
  if (domain === 'input_text') return <Text {...props} />;
  if (domain === 'light') return <Light {...props} />;
  if (domain === 'media_player') return <Media {...props} />;
  if (domain === 'weather') return <Weather {...props} />;

  return null;
}

Entity.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleChange: PropTypes.func
};

export default Entity;

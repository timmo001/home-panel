// @flow
import React from 'react';
import PropTypes from 'prop-types';

import { BaseProps } from './Base';
import State from '../HomeAssistant/State';
import Toggle from '../HomeAssistant/Toggle';

interface EntityProps extends BaseProps {}

function Entity(props: EntityProps) {
  const domain = props.card.entity && props.card.entity.split('.')[0].trim();
  props.card.domain = domain;
  if (!props.card.entity) props.card.entity = '';

  if (
    domain === 'air_quality' ||
    domain === 'binary_sensor' ||
    domain === 'device_tracker' ||
    domain === 'geo_location' ||
    domain === 'sensor' ||
    domain === 'sun'
  )
    return (
      <State
        card={props.card}
        hassConfig={props.hassConfig}
        hassEntities={props.hassEntities}
      />
    );

  if (
    domain === 'input_boolean' ||
    domain === 'light' ||
    domain === 'remote' ||
    domain === 'switch'
  )
    return (
      <Toggle
        card={props.card}
        hassConfig={props.hassConfig}
        hassEntities={props.hassEntities}
      />
    );

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

import React from 'react';
import PropTypes from 'prop-types';
import Camera from './Camera';
import Hass from './Hass';
import Link from './Link';

class Base extends React.Component {

  render() {
    const { config, theme, entities, card, handleChange, } = this.props;
    const type = !card.type ? 'hass' : card.type;
    if (type === 'hass') {
      return <Hass config={config} theme={theme} card={card} handleChange={handleChange} entities={entities} />
    } else if (type === 'link') {
      return <Link config={config} card={card} />
    } else if (type === 'camera') {
      return <Camera config={config} card={card} />
    } else return null;
  }
}

Base.propTypes = {
  config: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  card: PropTypes.object.isRequired,
};

export default Base;

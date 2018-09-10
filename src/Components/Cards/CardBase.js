import React from 'react';
import PropTypes from 'prop-types';
import Camera from './Camera/Camera';
import Hass from './Hass/Hass';
import Link from './Link/Link';
import Frame from './Frame/Frame';

class CardBase extends React.Component {

  render() {
    const { config, theme, entities, card, handleChange } = this.props;
    const type = !card.type ? 'hass' : card.type;
    if (type === 'hass') {
      return <Hass config={config} theme={theme} card={card} handleChange={handleChange} entities={entities} />
    } else if (type === 'link') {
      return <Link config={config} card={card} />
    } else if (type === 'camera') {
      return <Camera config={config} card={card} />
    } else if (type === 'iframe') {
      return <Frame config={config} card={card} />
    } else return null;
  }
}

CardBase.propTypes = {
  config: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  entities: PropTypes.array,
  card: PropTypes.object.isRequired,
};

export default CardBase;

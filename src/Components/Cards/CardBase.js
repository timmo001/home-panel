import React from 'react';
import PropTypes from 'prop-types';
import Camera from './Camera/Camera';
import Hass from './Hass/Hass';
import Link from './Link/Link';
import Frame from './Frame/Frame';

class CardBase extends React.Component {

  render() {
    const { config, editing, handleCardEdit, theme, haUrl, haConfig, entities, card, handleChange } = this.props;
    const type = !card.type ? 'hass' : card.type;
    if (type === 'hass') {
      return <Hass
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        theme={theme}
        card={card}
        haUrl={haUrl}
        haConfig={haConfig}
        entities={entities}
        handleChange={handleChange} />
    } else if (type === 'link') {
      return <Link
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        card={card} />
    } else if (type === 'camera') {
      return <Camera
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        card={card} />
    } else if (type === 'iframe') {
      return <Frame
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        card={card} />
    } else return null;
  }
}

CardBase.propTypes = {
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  card: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CardBase;

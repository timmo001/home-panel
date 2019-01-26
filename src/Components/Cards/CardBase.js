import React from 'react';
import PropTypes from 'prop-types';
import Camera from './Camera/Camera';
import Hass from './Hass/Hass';
import Link from './Link/Link';
import Frame from './Frame/Frame';
import Add from './Add';

class CardBase extends React.Component {

  render() {
    const { config, editing, handleCardEdit, handleCardAdd, theme, haUrl,
      haConfig, entities, groupId, cardId, card, handleChange } = this.props;
    const type = !card.type ? 'hass' : card.type;
    if (type === 'hass') {
      return <Hass
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        theme={theme}
        groupId={groupId}
        cardId={cardId}
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
        groupId={groupId}
        cardId={cardId}
        card={card} />
    } else if (type === 'camera') {
      return <Camera
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        groupId={groupId}
        cardId={cardId}
        card={card} />
    } else if (type === 'iframe') {
      return <Frame
        config={config}
        editing={editing}
        handleCardEdit={handleCardEdit}
        groupId={groupId}
        cardId={cardId}
        card={card} />
    } else if (type === 'add') {
      return <Add
        config={config}
        groupId={groupId}
        cardId={cardId}
        card={card}
        handleCardAdd={handleCardAdd} />
    } else return null;
  }
}

CardBase.propTypes = {
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  handleCardAdd: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default CardBase;

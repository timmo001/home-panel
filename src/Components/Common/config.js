export const getSquareCards = config => {
  var squareCards = true;
  if (config.theme && config.theme.ui && config.theme.ui.cards)
    squareCards = !config.theme.ui.cards.round;
  return squareCards;
};
export const getCardElevation = config => {
  var cardElevation = 1;
  if (config.theme && config.theme.ui && config.theme.ui.cards)
    cardElevation = config.theme.ui.cards.elevation;
  return cardElevation;
};

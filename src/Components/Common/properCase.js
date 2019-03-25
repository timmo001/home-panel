const properCase = text => {
  if (!typeof text === 'string' || typeof text === 'number' || !text)
    return text;
  const words = text.split('_');
  let newString = '';
  words.map(w => {
    return (newString +=
      w === 'ui' ? 'UI' : w.charAt(0).toUpperCase() + w.slice(1) + ' ');
  });
  return newString;
};

export default properCase;

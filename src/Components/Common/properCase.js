const properCase = (text) => {
  return text;
  if (!typeof text === 'string') return text;
  const words = text.split('_');
  let newString = '';
  words.map((w) => {
    return newString += w.charAt(0).toUpperCase() + w.slice(1) + ' ';
  });
  return newString;
}

export default properCase;

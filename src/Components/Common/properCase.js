const properCase = (string) => {
  const words = string.split('_');
  let newString = '';
  words.map((w) => {
    return newString += w.charAt(0).toUpperCase() + w.slice(1) + ' ';
  });
  return newString;
}

export default properCase;

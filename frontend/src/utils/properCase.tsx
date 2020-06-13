const properCase = (text: string): string => {
  if (!text) return text;
  if (!text.includes('_')) return text.charAt(0).toUpperCase() + text.slice(1);
  const words = text.split('_');
  let newString = '';
  words.map(w => {
    return (newString +=
      w === 'ui' ? 'UI' : w.charAt(0).toUpperCase() + w.slice(1) + ' ');
  });
  return newString;
};

export default properCase;

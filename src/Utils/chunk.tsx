const chunk = (array: any[], size: number): any[] => {
  if (!array.length) return [];
  return [array.slice(0, size)].concat(chunk(array.slice(size), size));
};

export default chunk;

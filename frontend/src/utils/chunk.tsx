const chunk = (array: unknown[], size: number): unknown[] => {
  if (!array.length) return [];
  return [array.slice(0, size)].concat(chunk(array.slice(size), size));
};

export default chunk;

const isObject = (val: unknown): boolean => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

export default isObject;

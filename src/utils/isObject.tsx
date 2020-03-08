// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val: any): boolean => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

export default isObject;

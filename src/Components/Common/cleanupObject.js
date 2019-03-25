const cleanupObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && Array.isArray(obj[key]))
      obj[key].map((i, x) => {
        i === null ? obj[key].splice(x, 1) : cleanupObject(i);
        return i;
      });
    else if (obj[key] && typeof obj[key] === 'object') cleanupObject(obj[key]);
    else obj[key] === null && delete obj[key];
  });
  return obj;
};

export default cleanupObject;

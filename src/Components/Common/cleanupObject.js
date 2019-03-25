import clone from './clone';

const cleanupObject = obj => {
  console.log('obj in:', clone(obj));
  Object.keys(obj).forEach(key => {
    console.log('obj[key] in:', clone(obj[key]));
    if (obj[key] && Array.isArray(obj[key]))
      obj[key].map((i, x) => {
        console.log('i in:', clone(i));
        i === null ? obj[key].splice(x, 1) : cleanupObject(i);
        console.log('i out:', clone(i));
        return i;
      });
    else if (obj[key] && typeof obj[key] === 'object') cleanupObject(obj[key]);
    else obj[key] === null && delete obj[key];
    console.log('obj[key] out:', clone(obj[key]));
  });
  console.log('obj out:', clone(obj));
  return obj;
};

export default cleanupObject;

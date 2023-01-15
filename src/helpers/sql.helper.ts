export const convertDateTimeToString = (val) => {
  if (!val) return 'NULL';
  const date = new Date(val);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  if (date.toString() === 'Invalid Date') return 'NULL';
  return `${date.toISOString()}`;
};

export const convertDateTimeToDateString = (val) => {
  if (!val) return 'NULL';
  const date = new Date(val);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  if (date.toString() === 'Invalid Date') return 'NULL';
  return `${date.toISOString().substring(0, 10)}`;
};

export const adddate = (val: Date, add: number) => {
  const newVal = new Date(val);
  newVal.setDate(newVal.getDate() + add);
  return newVal;
};

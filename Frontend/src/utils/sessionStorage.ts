export const getItemsFromSessionStorage = (key: string): null | any => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {}
  return null;
}

export const getItemsArrayFromSessionStorage = (key: string): Array<any> => {
  const items = getItemsFromSessionStorage(key);
  return (Array.isArray(items))
    ? items
    : [];
}

export const setItemsOnSessionStorage = (key: string, items: Array<any> ) => sessionStorage.setItem(key, JSON.stringify(items));

export const getItemsFromSessionStorage = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {}
  return null;
}

export const getItemsArrayFromSessionStorage = (key) => {
  const items = getItemsFromSessionStorage(key);
  return (Array.isArray(items))
    ? items
    : [];
}

export const setItemsOnSessionStorage = (key, items) => sessionStorage.setItem(key, JSON.stringify(items));

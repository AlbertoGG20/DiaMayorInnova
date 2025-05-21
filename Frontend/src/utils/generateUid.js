export const generateUid = (preffix = 'id') => `${preffix}-${Math.random().toString(32).slice(2, 11)}`;

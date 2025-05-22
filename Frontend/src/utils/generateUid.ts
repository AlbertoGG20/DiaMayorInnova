export const generateUid = (preffix: string = 'id'): string =>
  `${preffix}-${Math.random().toString(32).slice(2, 11)}`;

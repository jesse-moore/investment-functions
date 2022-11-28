export const checkTokenExpired = (time: number) => {
  const current = Number.parseInt((new Date().valueOf() / 1000).toString());
  return (time - current) < 30;
};

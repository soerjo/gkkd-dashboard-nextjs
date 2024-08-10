export const userShort = (username?: string) => {
  const userName = username?.split(" ") || [];
  if (userName.length === 1) return userName[0]?.charAt(0).toUpperCase();
  return userName[0]?.charAt(0).toUpperCase() + userName[1]?.charAt(0).toUpperCase();
};

import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const AUTH_TOKEN = "token";
export const AUTH_PAYLOAD = "payload";

export const setAuthCookie = (token: string, name: string) => {
  const toBase64 = Buffer.from(token).toString("base64");

  setCookie(name, toBase64, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    // more security options here
    // sameSite: 'strict',
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
  });
};

export const getAuthCookie = (name: string) => {
  const cookie = getCookie(name);

  if (!cookie) return undefined;

  return Buffer.from(cookie, "base64").toString("ascii");
};

export const removeCookies = (cookies: string[]) => {
  cookies.forEach(cookie => {
    deleteCookie(cookie);
  });
};

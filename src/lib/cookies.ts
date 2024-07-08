import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const AUTH_TOKEN = "token";
export const AUTH_PAYLOAD = "payload";

export const setAuthCookie = (token: string, name: string) => {
  const toBase64 = Buffer.from(token).toString("base64");

  setCookie(name, toBase64, {
    maxAge: 60 * 60 * 8, // set all cookies up to 8 hour
    path: "/",
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

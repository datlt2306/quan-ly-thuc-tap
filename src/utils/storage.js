import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const STORAGEKEY = {
  ACCESS_TOKEN: "access_token",
};

export const setCookie = (key, value) => {
  cookies.set(key, value);
};

export const getCookie = (key) => cookies.get(key);

export const removeCookie = async (key) => await cookies.remove(key);

export const saveLocal = (val) => {
  return localStorage.setItem("user", JSON.stringify(val));
};

export let getLocal = () => {
  // if (typeof window === "undefined") return false;
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};

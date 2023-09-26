import { useCallback } from "react";

const storage = window?.localStorage;
const base64Encode = btoa;
const base64Decode = atob;

export const useLocalStorage = () => {
  const has = useCallback((key) => {
    return storage.hasOwnProperty(key);
  }, []);

  const get = useCallback((item) => {
    if (item in storage) {
      return JSON.parse(base64Decode(storage.getItem(item)) || "");
    } else {
      return null;
    }
  }, []);

  const set = useCallback((key, item) => {
    try {
      storage.setItem(key, base64Encode(JSON.stringify(item)));
    } catch (e) {
      const msg = "unable to stringify item " + item;
      console.log(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    get,
    set,
    has,
  };
};

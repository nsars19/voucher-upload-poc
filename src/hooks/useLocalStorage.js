import { useCallback } from "react";

const storage = window?.localStorage;

export const useLocalStorage = () => {
  const get = useCallback((item) => {
    return JSON.parse(atob(storage.getItem(item)));
  }, []);

  const set = useCallback((key, item) => {
    try {
      storage.setItem(key, btoa(JSON.stringify(item)));
    } catch (e) {
      const msg = "unable to stringify item " + item;
      console.log(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    get,
    set,
  };
};

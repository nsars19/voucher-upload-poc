import { useCallback } from "react";

const storage = window?.localStorage;

export const useLocalStorage = () => {
  const get = useCallback((item) => {
    return JSON.parse(storage.getItem(item));
  }, []);

  const set = useCallback((item) => {
    try {
      storage.setItem(JSON.stringify(item));
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

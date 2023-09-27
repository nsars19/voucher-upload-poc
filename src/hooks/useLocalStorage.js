import { useCallback, useMemo } from "react";

const storage = window?.localStorage;
const base64Encode = btoa;
const base64Decode = atob;

export const useLocalStorage = () => {
  const has = useCallback((key) => {
    return storage.hasOwnProperty(key);
  }, []);

  const get = useCallback((item) => {
    try {
      if (item in storage) {
        return JSON.parse(base64Decode(storage.getItem(item)));
      } else {
        return null;
      }
    } catch (e) {
      throw new Error("Error fetching data from storage. ", e);
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

  const remove = useCallback((item) => {
    storage.removeItem(item);
  }, []);

  const storageMethods = useMemo(
    () => ({
      get,
      set,
      has,
      remove,
    }),
    [get, set, has, remove]
  );

  return storageMethods;
};

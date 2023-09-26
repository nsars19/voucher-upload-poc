import { useEffect, useState } from "react";
import useCognito from "./useCognito";
import { useLocalStorage } from "./useLocalStorage";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [params, setParams] = useState();
  const cognito = useCognito();
  const storage = useLocalStorage();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code") && !params) {
      setParams(urlParams);

      const newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?myNewUrlQuery=1";

      window.history.pushState({ path: newurl }, "", newurl);
    }
  }, [params]);

  useEffect(() => {
    if (!isLoggedIn && params?.has("code")) {
      // get tokens and store them
      cognito.getToken(params.get("code")).then((tokenData) => {
        storage.set("cognitoToken", tokenData.data);
      });
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, params, cognito, storage]);

  useEffect(() => {
    console.log(storage.get("cognitoToken"));
  });

  return {
    isLoggedIn,
    authenticateURL: cognito.authenticateURL,
  };
};

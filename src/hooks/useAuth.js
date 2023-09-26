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

    if (urlParams.has("code")) {
      console.log("found code: ", urlParams.get("code"));
      setParams(urlParams);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && params?.has("code")) {
      // get tokens and store them
      cognito.getToken(params.get("code")).then((tokenData) => {
        storage.set("cognitoToken", tokenData);
      });
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, params, cognito, storage]);

  return {
    isLoggedIn,
    authenticateURL: cognito.authenticateURL,
  };
};

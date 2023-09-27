import { useCallback, useEffect, useState } from "react";
import useCognito from "./useCognito";
import { useLocalStorage } from "./useLocalStorage";

let didInit = false;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [params, setParams] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cognito = useCognito();
  const storage = useLocalStorage();

  const getToken = useCallback(() => {
    setIsLoading(true);
    cognito
      .getToken(params.get("code"))
      .then((tokenData) => {
        if (tokenData.error) {
          throw new Error("Error authenticating");
        }

        storage.set("cognitoToken", tokenData.data);
        setIsLoggedIn(true);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setHasError(true);
      });
  }, [cognito, params, storage]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("code") && !params) {
      setParams(urlParams);

      const newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;

      window.history.pushState({ path: newurl }, "", newurl);
    }
  }, [params]);

  useEffect(() => {
    if (storage.has("cognitoToken")) {
      setIsLoggedIn(true);
    } else if (hasError) {
      return;
    } else if (!didInit && !isLoggedIn && params?.has("code")) {
      getToken();
      didInit = true;
    }
  }, [getToken, isLoggedIn, params, storage, hasError]);

  return {
    isLoggedIn,
    hasError,
    isAuthenticating: isLoading,
    authenticateURL: cognito.authenticateURL,
  };
};

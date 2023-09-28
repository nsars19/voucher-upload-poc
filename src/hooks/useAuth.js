import { useCallback, useEffect, useState } from "react";
import useCognito from "./useCognito";
import { useLocalStorage } from "./useLocalStorage";
import useToken from "./useToken";

let didInit = false;

const APIGroup = "GetCatFact";
const userFields = {
  firstName: "custom:givenname",
  lastName: "custom:sn",
  campus: "custom:umasscampus",
  guid: "custom:guid",
  displayName: "custom:displayname",
  emplid: "custom:emplid",
  email: "email",
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [params, setParams] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cognito = useCognito();
  const storage = useLocalStorage();
  const { idToken } = useToken();

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

  const signOut = () => {
    storage.remove("cognitoToken");
    setIsLoggedIn(false);
    setParams(null);
    window.location.href = window.location.href;
  };

  const userCanAccessAPI = useCallback(() => {
    if (!idToken) {
      throw new Error("No token found");
    }

    return cognito.getUserGroups(idToken.payload).includes(APIGroup);
  }, [cognito, idToken]);

  const getAuthToken = useCallback(() => {
    return idToken.token;
  }, [idToken]);

  const getUserProperties = useCallback(() => {
    return Object.entries(userFields).reduce((acc, [key, value]) => {
      acc[key] = idToken.payload[value];
      return acc;
    }, {});
  }, [idToken]);

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
    signOut,
    userCanAccessAPI,
    getAuthToken,
    getUserProperties,
    isAuthenticating: isLoading,
    authenticateURL: cognito.authenticateURL,
  };
};

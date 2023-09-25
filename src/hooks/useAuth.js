import { useEffect, useState } from "react";
import { Cognito } from "../util/cognito";

const cognito = new Cognito();

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [params, setParams] = useState();

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

      setIsLoggedIn(true);
    }
  }, [isLoggedIn, params]);

  return {
    isLoggedIn,
    authenticateURL: cognito.authenticateURL,
  };
};

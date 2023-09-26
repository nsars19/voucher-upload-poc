import { createContext, useMemo } from "react";
import { Cognito } from "../util/cognito";

export const CognitoContext = createContext({});

export default function CognitoProvider({ children }) {
  const cognito = useMemo(() => new Cognito(), []);

  return (
    <CognitoContext.Provider value={cognito}>
      {children}
    </CognitoContext.Provider>
  );
}

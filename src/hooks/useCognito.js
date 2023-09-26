import { useContext } from "react";
import { CognitoContext } from "../context/cognito";

export default function useCognito() {
  const context = useContext(CognitoContext);
  if (context === undefined) {
    throw new Error("useCognito must be used within CognitoProvider context");
  }

  return context;
}

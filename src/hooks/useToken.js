import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const base64Decode = atob;
const decode = (item) => JSON.parse(base64Decode(item));

export default function useToken() {
  const storage = useLocalStorage();

  const [idToken, accessToken, refreshToken] = useMemo(() => {
    const cognitoTokens = storage.get("cognitoToken");
    console.log(cognitoTokens);
    const [idHeader, idPayload, idSignature] =
      cognitoTokens.id_token.split(".");
    const [accessHeader, accessPayload, accessSignature] =
      cognitoTokens.access_token.split(".");
    const refreshToken = cognitoTokens.refresh_token;

    return [
      {
        token: cognitoTokens.id_token,
        header: decode(idHeader),
        payload: decode(idPayload),
        signature: idSignature,
      },
      {
        token: cognitoTokens.access_token,
        header: decode(accessHeader),
        payload: decode(accessPayload),
        signature: accessSignature,
      },
      refreshToken,
    ];
  }, [storage]);

  return {
    idToken,
    accessToken,
    refreshToken,
  };
}

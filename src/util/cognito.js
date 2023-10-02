import { CognitoJwtVerifier } from "aws-jwt-verify";

export class Cognito {
  host = "https://webdev-poc.auth.us-east-1.amazoncognito.com";
  clientId = "1qq369qvpm8gk73gmatgo72qa0";
  userPoolId = "us-east-1_5ZTuRKRqv";
  responseType = "code";
  scope = "email openid phone profile";
  redirectURI = "https://d1f7ykf17cxubq.cloudfront.net";

  params =
    "?" +
    new URLSearchParams({
      client_id: this.clientId,
      response_type: this.responseType,
      scope: this.scope,
      redirect_uri: this.redirectURI,
    });

  basePath = "/oauth2";
  paths = {
    authorize: "/authorize",
    userInfo: "/userInfo",
    token: "/token",
  };

  cognitoOAuthURL = this.host + this.basePath;
  authenticateURL = this.cognitoOAuthURL + this.paths.authorize + this.params;
  tokenURL = this.cognitoOAuthURL + this.paths.token;
  userInfoURL = this.cognitoOAuthURL + this.paths.userInfo;

  _getVerifier(tokenType) {
    return CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: tokenType, // 'id' or 'access'
      clientId: this.clientId,
    });
  }

  async _verify(type, token) {
    try {
      return {
        isValid: true,
        payload: await this._getVerifier(type).verify(token),
      };
    } catch (e) {
      return {
        isValid: false,
        payload: null,
      };
    }
  }

  async verifyIdToken(token) {
    return this._verify("id", token);
  }

  async verifyAccessToken(token) {
    return this._verify("access", token);
  }

  async getToken(code) {
    if (!code) throw new Error("No `code` provided");
    try {
      const response = await fetch(this.tokenURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: this.clientId,
          redirect_uri: this.redirectURI,
          code,
        }),
      });

      const responseData = await response.json();

      return {
        data: responseData,
        error: false,
        message: null,
      };
    } catch (e) {
      return {
        error: true,
        message: "Unable to authenticate. error: " + e,
        data: null,
      };
    }
  }

  getUserGroups(token) {
    if (!("cognito:groups" in token)) {
      return [];
    }

    return token["cognito:groups"];
  }
}

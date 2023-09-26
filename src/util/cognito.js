export class Cognito {
  host = "https://webdev-poc.auth.us-east-1.amazoncognito.com";
  clientId = "1qq369qvpm8gk73gmatgo72qa0";
  responseType = "code";
  scope = "email openid phone profile";
  redirectURI = "https://d1f7ykf17cxubq.cloudfront.net/";

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
    authorize: { path: "/authorize", method: "GET" },
    userInfo: { path: "/userInfo", method: "GET" },
    token: { path: "/token", method: "POST" },
  };

  cognitoOAuthURL = this.host + this.basePath;
  authenticateURL =
    this.cognitoOAuthURL + this.paths.authorize.path + this.params;
  tokenURL = this.cognitoOAuthURL + this.paths.token.path;

  async getToken(code) {
    if (!code) throw new Error("No `code` provided");
    try {
      const response = await fetch(
        this.cognitoOAuthURL + this.paths.token.path,
        {
          method: this.paths.token.method,
          headers: {
            "Content-Type": "application/x-www-url-formencoded",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: this.clientId,
            redirect_uri: this.redirectURI,
            code,
          }),
        }
      );

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
}

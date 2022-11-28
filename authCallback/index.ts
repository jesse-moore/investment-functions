import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { env } from "process";
import { HttpClient } from "../services/httpClient";
import { initTableClient } from "../services/tableClient";
import { TDAmeritradeTokenRequest } from "../dtos/TDAmeritradeTokenRequest.dto";
import { TDAmeritradeErrorResponse, TDAmeritradeRefreshTokenResponse } from "../dtos/TDAmeritradeTokenResponse.dto";
import { Token } from "../models/Token";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const codes = req.query.code;
  if (!codes) throw new Error("Invalid or missing authentication code");

  const [azureKey, tdCode] = codes.split(",");

  try {
    if (!tdCode) {
      throw new Error("Invalid or missing authentication code");
    }

    const functionURL = new URL(req.url);
    const redirect_uri = functionURL.origin + functionURL.pathname + "?code=" + azureKey;

    const url = "https://api.tdameritrade.com/v1/oauth2/token";
    const formData: TDAmeritradeTokenRequest = {
      redirect_uri,
      grant_type: "authorization_code",
      access_type: "offline",
      code: decodeURI(tdCode),
      client_id: `${env.TDAmeritradeConsumerKey}@AMER.OAUTHAP`,
    };
    const tokenResponse = await HttpClient.postFormData<TDAmeritradeRefreshTokenResponse | TDAmeritradeErrorResponse>(
      url,
      formData
    );

    if ("error" in tokenResponse) {
      throw new Error(tokenResponse.error);
    } else {
      const client = initTableClient("authTokens");

      const authToken = new Token();
      authToken.partitionKey = "TD_AMERITRADE";
      authToken.rowKey = "AUTH_TOKEN";
      authToken.value = tokenResponse.access_token;
      let expireDate = Number.parseInt((new Date().valueOf() / 1000).toString());
      authToken.expireTime = expireDate + tokenResponse.expires_in;
      await client.upsertEntity(authToken);

      const refreshToken = new Token();
      refreshToken.partitionKey = "TD_AMERITRADE";
      refreshToken.rowKey = "REFRESH_TOKEN";
      refreshToken.value = tokenResponse.refresh_token;
      expireDate = Number.parseInt((new Date().valueOf() / 1000).toString());
      refreshToken.expireTime = expireDate + tokenResponse.refresh_token_expires_in;
      await client.upsertEntity(refreshToken);
      context.res = {
        status: 200,
        body: "Successfully Connected to TD Ameritrade Account",
      };
    }
  } catch (_error) {
    let error = "";
    if ("message" in _error) {
      error = _error.message;
    } else {
      error = _error;
    }
    context.res = {
      status: 400,
      body: error,
    };
  }
};

export default httpTrigger;

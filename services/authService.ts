import { env } from "process";
import { TDAmeritradeRefreshTokenRequest, TDAmeritradeTokenRequest } from "../dtos/TDAmeritradeTokenRequest.dto";
import { TDAmeritradeErrorResponse, TDAmeritradeRefreshTokenResponse } from "../dtos/TDAmeritradeTokenResponse.dto";
import { Token } from "../models/Token";
import { HttpClient } from "./httpClient";
import { initTableClient } from "./tableClient";
import { checkTokenExpired } from "./utils";

const TD_AMERITRADE_AUTH_URL = "https://api.tdameritrade.com/v1/oauth2/token";

export const getAuthToken = async () => {
  const client = initTableClient("authTokens");
  const authToken = await client.getEntity<Token>("TD_AMERITRADE", "AUTH_TOKEN");
  let token = authToken.value;

  if (checkTokenExpired(authToken.expireTime)) {
    token = await refreshAuthToken();
  }
  return token;
};

export const refreshAuthToken = async () => {
  const client = initTableClient("authTokens");
  const refresh_token = (await client.getEntity<Token>("TD_AMERITRADE", "REFRESH_TOKEN")).value;

  const formData: TDAmeritradeRefreshTokenRequest = {
    grant_type: "refresh_token",
    client_id: `${env.TDAmeritradeConsumerKey}@AMER.OAUTHAP`,
    refresh_token,
  };
  const tokenResponse = await HttpClient.postFormData<TDAmeritradeRefreshTokenResponse | TDAmeritradeErrorResponse>(
    TD_AMERITRADE_AUTH_URL,
    formData
  );

  if ("error" in tokenResponse) {
    throw new Error(tokenResponse.error);
  }

  const authToken = new Token();
  authToken.partitionKey = "TD_AMERITRADE";
  authToken.rowKey = "AUTH_TOKEN";
  authToken.value = tokenResponse.access_token;
  let expireDate = Number.parseInt((new Date().valueOf() / 1000).toString());
  authToken.expireTime = expireDate + tokenResponse.expires_in;
  await client.updateEntity(authToken, "Merge");

  return authToken.value;
};

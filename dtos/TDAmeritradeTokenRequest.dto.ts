export type TDAmeritradeTokenRequest =
  | TDAmeritradeAuthTokenRequest
  | TDAmeritradeRefreshTokenRequest;

export class TDAmeritradeAuthTokenRequest {
  [key: string]: string;
  grant_type: "authorization_code";
  access_type: "offline";
  code: string;
  client_id: string;
  redirect_uri: string;
}
export class TDAmeritradeRefreshTokenRequest {
  [key: string]: string;
  grant_type: "refresh_token";
  refresh_token: string;
  access_type?: "offline";
  client_id: string;
}

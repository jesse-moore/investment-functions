export class TDAmeritradeErrorResponse {
  error: string;
}

export class TDAmeritradeAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class TDAmeritradeRefreshTokenResponse extends TDAmeritradeAuthTokenResponse {
  refresh_token: string;
  refresh_token_expires_in: number;
}

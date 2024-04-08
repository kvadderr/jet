export interface AccessTokenPayload {
  userId: number;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenVersion: number;
}
export class AccessTokenPayload {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  accessToken: string;
}

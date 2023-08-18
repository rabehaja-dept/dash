export type Token = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  anonymous_id?: string;
};

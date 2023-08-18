export type Token = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  anonymous_id?: string;
};

export interface EmailPayload {
  to: string;
  subject: string;
  title: string;
  text: string;
  cta: {
    text: string;
    url: string;
  };
}

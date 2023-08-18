export type Email = {
  to: string;
  subject: string;
  html?: string;
  title?: string;
  text?: string;
  cta?: {
    text: string;
    url: string;
  };
};

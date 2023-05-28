export type InformativeMail = {
  app_name: string;
  app_url: string;
};

export type TokenizedMail = InformativeMail & {
  url: string;
};

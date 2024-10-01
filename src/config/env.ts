export const ENV = {
  DB: {
    HOST: process.env.DB_HOST ?? "",
    USERNAME: process.env.DB_USER ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    DATABASE: process.env.DB_DATABASE ?? "",
    PORT: Number(process.env.DB_PORT ?? 3306),
  },
  SMTP: {
    HOST: process.env.SMTP_HOST ?? "",
    PORT: Number(process.env.SMTP_PORT ?? 465),
    USER: process.env.SMTP_USER ?? "",
    PASSWORD: process.env.SMTP_PASSWORD ?? "",
    SECURE: (process.env.SMTP_SECURE ?? "false") === "true",
  },
  SERVER: {
    PORT: Number(process.env.SERVER_PORT ?? 3000),
  },
  SECRETS: {
    JWT: process.env.SECRET_JWT ?? "",
  },
};

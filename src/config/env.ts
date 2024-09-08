export const ENV = {
  DB: {
    HOST: process.env.DB_HOST ?? "",
    USERNAME: process.env.DB_USER ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    DATABASE: process.env.DB_DATABASE ?? "",
    PORT: Number(process.env.DB_PORT ?? 3306),
  },
  SERVER: {
    PORT: Number(process.env.SERVER_PORT ?? 3000),
  },
  SECRETS: {
    JWT: process.env.SECRET_JWT ?? "",
  },
};

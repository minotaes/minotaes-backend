import { Sequelize } from "sequelize";
import { ENV } from "../../config/env.js";

const { DATABASE, USERNAME, PASSWORD, HOST, PORT } = ENV.DB;

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: "mariadb",
  logging: false,
});

export async function connectDatabase() {
  await sequelize.sync({ force: false, alter: false });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}

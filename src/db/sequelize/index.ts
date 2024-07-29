import { Sequelize } from "sequelize";
import { ENV } from "../../env.js";

const { DATABASE, USERNAME, PASSWORD, HOST, PORT, DIALECT } = ENV.DB.SEQUELIZE;

export const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: DIALECT,
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

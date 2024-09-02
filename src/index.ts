import { ENV } from "./config/env.js";
import { api, createEndpoints } from "./api/index.js";
import { UserModel } from "./db/sequelize/model/index.js";

api.listen(ENV.SERVER.PORT, () => {
  console.log("Server is running on port: ", ENV.SERVER.PORT);

  createEndpoints({
    models: {
      user: new UserModel(),
    },
  });
});

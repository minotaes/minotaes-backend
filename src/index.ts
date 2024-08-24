import { ENV } from "./config/env.js";
import { api } from "./api/index.js";

api.listen(ENV.SERVER.PORT, () => {
  console.log("Server is running on port: ", ENV.SERVER.PORT);
});

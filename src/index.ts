import { api } from "./api/index.js";

api.listen(8000, () => {
  console.log("Server is running on port 8000");
});

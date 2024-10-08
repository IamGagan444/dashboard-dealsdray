import "dotenv/config.js"
import { dbConnection } from "./db/index.js";
import { app } from "./app.js";

dbConnection().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("server connection error index.js", err));

import { dbConnection } from "../src/db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

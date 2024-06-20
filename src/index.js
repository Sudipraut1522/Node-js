import { dbConnection } from "../src/db/index.js";
import dotenv from "dotenv";
import { liketabel } from "./models/like.modal.js";
import { app } from "./app.js";
import { syncWatchHistory } from "./models/watchhistory.js";
import { commentTabe } from "./models/comments.js";
dotenv.config({
  path: "./.env",
});

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on PORT ${process.env.PORT || 8000}`);
    });
    liketabel();
    syncWatchHistory();
    commentTabe();
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

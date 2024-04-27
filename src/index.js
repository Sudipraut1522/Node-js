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

// app.post("/upload", upload.single("image"), fileUpload, async (req, res) => {
//   try {
//     const imageUrl = req.uploadResult.filename;
//     const { fullname } = req.body;

//     const newFile = await File.create({
//       image: imageUrl,
//       fullname,
//     });

//     res.status(200).json({ message: "File uploaded successfully", newFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error uploading file" });
//   }
// });
// // Route for file upload
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const imageUrl = req.file.filename;
//     const { fullname } = req.body;

//     const newFile = await File.create({
//       image: imageUrl,
//       fullname,
//     });

//     console.log("Image uploaded and URL saved in PostgreSQL:", imageUrl);

//     res.json(newFile);
//   } catch (error) {
//     console.error("Error uploading image:", error);

//     res.status(500).send("Error uploading image");
//   }
// });

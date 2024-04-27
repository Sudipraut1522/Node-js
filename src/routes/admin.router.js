import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  usersDetail,
  deleteUser,
  uploadVideo,
  loginAdmin,
} from "../controller/video.controller.js";
import { adminMiddleware } from "../middlewares/adminmiddleware.js";

const adminRouter = Router();
adminRouter.route("/adminlogin").post(loginAdmin);

adminRouter.route("/userDetail/").get(usersDetail);
adminRouter.route("/delete/:id").get([adminMiddleware, deleteUser]);
adminRouter
  .route("/upload/:username")
  .post([adminMiddleware, upload.single("url"), uploadVideo]);

export { adminRouter };

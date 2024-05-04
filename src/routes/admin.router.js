import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  usersDetail,
  deleteUser,
  uploadVideo,
  loginAdmin,
  getAllVideo,
} from "../controller/video.controller.js";
import { adminMiddleware } from "../middlewares/adminmiddleware.js";

const adminRouter = Router();
adminRouter.route("/adminlogin").post(loginAdmin);

adminRouter.route("/userDetail").get(usersDetail);
adminRouter.route("/videos").get(getAllVideo);

adminRouter.route("/upload").post([upload.single("videourl"), uploadVideo]);
adminRouter.route("/delete/:id").delete(deleteUser);
// adminRouter
//   .route("/upload/:username")
//   .post([adminMiddleware, upload.single("url"), uploadVideo]);

export { adminRouter };

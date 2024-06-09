import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  usersDetail,
  deleteUser,
  uploadVideo,
  loginAdmin,
  getAllVideo,
  deleteVideo,
  editVideo,
  getVideoById,
  getReport,
  getVideo,
} from "../controller/video.controller.js";
import { adminMiddleware } from "../middlewares/adminmiddleware.js";
import { userAuth } from "../middlewares/userauthentaction.js";

const adminRouter = Router();
adminRouter.route("/adminlogin").post(loginAdmin);

adminRouter.route("/userDetail").get(usersDetail);
adminRouter.route("/videos").get(userAuth, getAllVideo);

adminRouter.route("/upload").post([upload.single("videourl"), uploadVideo]);
adminRouter.route("/delete/:id").delete(userAuth, deleteUser);
adminRouter.route("/deletevideo/:id").delete(userAuth, deleteVideo);
adminRouter
  .route("/editvideo/:id")
  .patch([upload.single("videourl"), userAuth, editVideo]);
adminRouter.route("/getvideo/:id").get([userAuth, getVideoById]);
adminRouter.route("/getvideos/:id").get(userAuth, getVideo);

adminRouter.route("/report").get(getReport);

export { adminRouter };

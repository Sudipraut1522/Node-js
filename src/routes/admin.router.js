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
  getAllComment,
  deleteComment,
} from "../controller/video.controller.js";
import { adminMiddleware } from "../middlewares/adminmiddleware.js";
import { userAuth } from "../middlewares/userauthentaction.js";
import { isApproved } from "../controller/RegisterApproved.js";

const adminRouter = Router();
adminRouter.route("/adminlogin").post(loginAdmin);

adminRouter.route("/userDetail").get(usersDetail);
adminRouter.route("/isapproved/:id").post(isApproved);

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
adminRouter.route("/viewcomment").get(userAuth, getAllComment);
adminRouter.route("/deletecomment/:id").delete(userAuth, deleteComment);

export { adminRouter };

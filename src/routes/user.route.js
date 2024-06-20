import { Router } from "express";
import {
  editUserProfile,
  loginUser,
  registerUser,
  userProfile,
} from "../controller/users.controller.js";
import {
  getAllComment,
  getAllWatchHistory,
  getCommentByID,
  userComment,
  userWatched,
  userlike,
  videoViews,
} from "../controller/video.controller.js";
import { userAuth } from "../middlewares/userauthentaction.js";
import { imageUpload } from "../middlewares/userMulter.js";

const router = Router();

router.route("/register").post(imageUpload.single("imageurl"), registerUser);
router
  .route("/editprofile")
  .patch(imageUpload.single("imageurl"), userAuth, editUserProfile);

router.route("/login").post(loginUser);
router.route("/userProfile").get(userAuth, userProfile);

router.route("/views/:id").post(userAuth, videoViews);
router.route("/like/:id").post(userAuth, userlike);
router.route("/watchedvideo/:id").post(userAuth, userWatched);
router.route("/watchHistory").get(userAuth, getAllWatchHistory);
router.route("/comment/:id").post(userAuth, userComment);
router.route("/getcomment/:id").get(userAuth, getCommentByID);

export { router };

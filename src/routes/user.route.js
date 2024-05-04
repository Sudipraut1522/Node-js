import { Router } from "express";
import { loginUser, registerUser } from "../controller/users.controller.js";
import { videoViews } from "../controller/video.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/views/:id").post(videoViews);

export { router };

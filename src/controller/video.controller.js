import { Users } from "../models/users.models.js";
import { VideoModel } from "../models/video.model.js";
import { asyncHandler } from "../utils/asynchandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import uploadOnCloudinary from "../utils/cloudnary.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";

// const videoUpload = asyncHandler(async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if ([title, description].some((result) => result?.trim() == "")) {
//       throw new ApiError(400, "All fields are required");
//     } else {
//       const existedVideoTitle = await Video.findOne({
//         where: {
//           title: title,
//         },
//       });
//       if (existedVideoTitle) {
//         throw new ApiError(409, "video with title is already existed !!");
//       }
//       const avatarLocalPath = req.files?.avatar[0]?.path;
//       //   const coverImagesLocalPath = req.files?.coverimages[0]?.path;

//       if (!avatarLocalPath) {
//         throw new ApiError(400, "Avtar file is required");
//       }
//       const avatar = await uploadOnCloudinary(avatarLocalPath);
//       //   const coverimage = await uploadOnCloudinary(coverImagesLocalPath);

//       if (!avatar) {
//         throw new ApiError(400, "Avtar file is required");
//       }

//       const user = await Video.create({
//         title,
//         avatar: avatar, // Assuming avatar is provided in the request body
//         description,
//       });

//       const createdUser = await Video.findByPk(user.id);
//       if (!createdUser) {
//         throw new ApiError(500, "User registration failed");
//       }
//       return res.status(201).json({ message: "User Register success" });
//     }
//   } catch (err) {
//     console.log("error", err);
//   }
// });
const secretKey = "dasdas";
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email:", email, "password:", password);

    const user = await Users.findOne({
      where: { email: email, password: password },
    });
    console.log("isadin:", user.isAdmin);

    if (!user.isAdmin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const id = user.id;
    console.log(id);

    if (user.isAdmin == true) {
      jwt.sign({ id }, secretKey, { expiresIn: "400s" }, (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res
          .status(200)
          .json({ message: "Login Successful", token, isAdmin: user.isAdmin });
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

const getAllVideo = asyncHandler(async (req, res) => {
  try {
    const allVideo = await VideoModel.findAll();

    res.status(200).json({ users: allVideo });
  } catch (error) {
    console.error("Error occurred while retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const usersDetail = asyncHandler(async (req, res) => {
  try {
    const allUsers = await Users.findAll();

    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error("Error occurred while retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userID = req.params.id;
  console.log("id", userID);

  try {
    const users = await Users.destroy({
      where: {
        id: userID,
      },
    });
    console.log("users");

    res.status(200).json({ message: "Userdeleted Successful" });
  } catch (err) {
    res.send("error");
  }
});

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, teachername } = req.body;
    console.log("title", description);

    if (
      [title, description, teachername].some((result) => result?.trim() == "")
    ) {
      throw new ApiError(400, "All fields are required");
    } else {
      const existingVideo = await VideoModel.findOne({
        where: {
          title: title,
        },
      });

      if (existingVideo) {
        throw new ApiError(409, "Video with title already exists");
      }

      const videoFile = req.file?.path;

      if (!videoFile) {
        throw new ApiError(400, "video and image file is required");
      }

      const cloudinaryResponse = await uploadOnCloudinary(videoFile);
      if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
      }

      const video = await VideoModel.create({
        title: title,
        videourl: cloudinaryResponse.secure_url,
        description: description,
        teachername: teachername,
      });

      if (!video) {
        throw new ApiError(500, "Video creation failed");
      }

      return res.status(201).json({ message: "Video uploaded successfully" });
    }
  } catch (err) {
    console.error("Error uploading video:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Sorry, failed to upload video" });
  }
});

const videoViews = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  console.log("videoid", videoId);
  try {
    const videos = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });
    console.log("videodetail", videos);

    if (!videos) {
      return res.status(404).json({ error: "Video not found" });
    }

    videos.views++;
    await videos.save();

    return res.status(200).json({ message: "View counted successfully" });
  } catch (err) {
    return res.status(404).json({ err: "Server error" });
  }
});
export {
  usersDetail,
  deleteUser,
  uploadVideo,
  loginAdmin,
  getAllVideo,
  videoViews,
};

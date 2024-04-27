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

    if (!user) {
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

const usersDetail = asyncHandler(async (req, res) => {
  // try {
  //   const { isAdmin } = req.params;
  //   console.log("username", isAdmin.isAdmin);

  //   const admin = await Users.findOne({
  //     where: {
  //       isAdmin: isAdmin,
  //     },
  //   });
  //   console.log("user", admin.isAdmin);
  //   if (admin.isAdmin == false) {
  //     return res.status(500).json("user not found");
  //   }

  //   if (admin.isAdmin == true) {
  try {
    const allUsers = await Users.findAll();

    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error("Error occurred while retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  // } else {
  //   res.send("your are not a admin");
  // }
  // } catch (err) {
  //   console.log(err);
  // }
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
    const { title, description, teacher } = req.body;

    if ([title, description, teacher].some((result) => result?.trim() == "")) {
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
      console.log("videofile", videoFile); // Assuming the video file is uploaded with the key 'video'
      if (!videoFile) {
        throw new ApiError(400, "Video file is required");
      }

      const cloudinaryResponse = await uploadOnCloudinary(videoFile);
      if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
      }

      const video = await VideoModel.create({
        title: title,
        url: cloudinaryResponse.secure_url, // Assuming you want to save the Cloudinary URL
        description: description,
        teacher: teacher,
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
// import multer from "multer";
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { VideoModel } from "./models/VideoModel"; // Assuming you have a VideoModel defined

// Configure Cloudinary with your cloud name, API key, and API secret
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadVideo = async (req, res) => {
//   try {
//     const { title, description, teacher } = req.body;

//     // Check if any required fields are empty or missing
//     if (![title, description, teacher].every(Boolean)) {
//       throw new Error("All fields are required");
//     }

//     // Check if a video with the same title already exists
//     const existingVideo = await VideoModel.findOne({
//       where: {
//         title: title,
//       },
//     });
//     if (existingVideo) {
//       throw new Error("Video with title already exists");
//     }

//     // Check if a video file is uploaded
//     if (!req.file) {
//       throw new Error("Video file is required");
//     }

//     // Upload the video file to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);

//     // Create a new video record in the database
//     const video = await VideoModel.create({
//       title,
//       url: cloudinaryResponse.secure_url,
//       description,
//       teacher,
//     });

//     // Send success response if everything goes well
//     res.status(201).json({ message: "Video uploaded successfully", video });
//   } catch (err) {
//     console.error("Error uploading video:", err.message);
//     res
//       .status(500)
//       .json({ message: err.message || "Sorry, failed to upload video" });
//   }
// };

// export { uploadVideo, upload };

export { usersDetail, deleteUser, uploadVideo, loginAdmin };

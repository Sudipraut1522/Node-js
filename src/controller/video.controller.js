import { Users } from "../models/users.models.js";
import { VideoModel } from "../models/video.model.js";
import { asyncHandler } from "../utils/asynchandlers.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";
import { Like } from "../models/like.modal.js";
import { WatchHistory } from "../models/watchhistory.js";

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
      jwt.sign({ id }, secretKey, (err, token) => {
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
const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (error) {
    console.error("Error occurred while retrieving video:", error);
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
const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  try {
    await Like.destroy({
      where: {
        videoId: videoId,
      },
    });

    await VideoModel.destroy({
      where: {
        id: videoId,
      },
    });

    res.status(200).json({ message: "Video deletion successful" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ error: "Failed to delete video" });
  }
});

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, teachername, category } = req.body;
    console.log("title", description);

    if (
      [title, description, teachername, category].some(
        (result) => result?.trim() == ""
      )
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
        category: category,
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
const editVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("videoid0", id);
    const { title, description, teachername, category } = req.body;
    console.log("dajshdjasdasd", title);
    if (
      ![title, description, teachername, category].every(
        (field) => field && field.trim()
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingVideo = await VideoModel.findByPk(id);
    if (!existingVideo) {
      throw new ApiError(404, "Video not found");
    }

    existingVideo.title = title;
    existingVideo.description = description;
    existingVideo.teachername = teachername;
    existingVideo.category = category;
    await existingVideo.save();

    return res.status(200).json({ message: "Video updated successfully" });
  } catch (err) {
    console.error("Error editing video:", err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to edit video" });
  }
});

const videoViews = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
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

const userlike = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  const ID = req.user; // Assuming you have user information available in req.user
  const userId = ID.user.id; // Assuming userId is nested under 'user'

  try {
    // Check if the user has already liked the video
    const existingLike = await Like.findOne({
      where: {
        userId: userId,
        videoId: videoId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "User has already liked this video" });
    }

    // Increment the like count for the video
    const video = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Increment the like count using Sequelize's increment method
    await video.increment("likeVideo");

    // Create a like entry for the user and the video
    await Like.create({
      userId: userId,
      videoId: videoId,
    });

    return res.status(200).json({
      message: "Like counted successfully",
      like: video.likeVideo, // Assuming 'likeVideo' is the attribute storing the like count in your VideoModel
    });
  } catch (err) {
    console.error("Error counting like:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
const userWatched = async (req, res) => {
  const ID = req.user;
  const userId = ID.user.id;
  const videoId = req.params.id;
  try {
    const watchhistory = await WatchHistory.create({ userId, videoId });

    return res
      .status(201)
      .json({ message: "Watch history recorded successfully" });
  } catch (error) {
    console.error("Error recording watch history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getAllWatchHistory = async (req, res) => {
  try {
    const ID = req.user;
    const userId = ID.user.id;

    const watchHistory = await WatchHistory.findAll({
      where: { userId },
      include: [{ model: VideoModel }],
    });

    if (watchHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No watch history found for this user" });
    }

    const formattedHistory = watchHistory.map((entry) => ({
      watchedAt: entry.watchedAt,
      videoUrl: entry.Video.videourl,
      category: entry.Video.category,
      title: entry.Video.title,
      teachername: entry.Video.teachername,
      views: entry.Video.views,
    }));

    res.status(200).json({ watchHistory: formattedHistory });
  } catch (error) {
    console.error("Error retrieving watch history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  usersDetail,
  deleteUser,
  uploadVideo,
  loginAdmin,
  getAllVideo,
  videoViews,
  deleteVideo,
  editVideo,
  userlike,
  userWatched,
  getAllWatchHistory,
  getVideoById,
};

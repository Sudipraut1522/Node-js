import { Users } from "../models/users.models.js";
import { VideoModel } from "../models/video.model.js";
import { asyncHandler } from "../utils/asynchandlers.js";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";
import { Like } from "../models/like.modal.js";
import { WatchHistory } from "../models/watchhistory.js";

const secretKey = "dasdas";
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: { email: email, password: password },
    });

    if (!user.isAdmin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const id = user.id;

    if (user.isAdmin == true) {
      jwt.sign({ id }, secretKey, (err, token) => {
        if (err) {
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
    res.status(500).json({ message: "Invalid email or password" });
  }
});

const getAllVideo = asyncHandler(async (req, res) => {
  try {
    const allVideo = await VideoModel.findAll();

    res.status(200).json({ users: allVideo });
  } catch (error) {
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
    res.status(500).json({ message: "Internal server error" });
  }
});
const usersDetail = asyncHandler(async (req, res) => {
  try {
    const allUsers = await Users.findAll();

    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const userID = req.params.id;

  try {
    const users = await Users.destroy({
      where: {
        id: userID,
      },
    });

    res.status(200).json({ message: "Userdeleted Successful" });
  } catch (err) {
    res.json({ message: "Something went Wrong" });
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
    res.status(500).json({ error: "Failed to delete video" });
  }
});

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, teachername, category, subCategory } = req.body;

    if (
      [title, description, teachername, category, subCategory].some(
        (result) => result?.trim() == ""
      )
    ) {
      res.status(400).json({ message: "All fields are required" });
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
        category: category.toUpperCase(),
        subCategory: subCategory,
      });

      if (!video) {
        throw new ApiError(500, "Video creation failed");
      }

      return res.status(201).json({ message: "Video uploaded successfully" });
    }
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Sorry, failed to upload video" });
  }
});
const editVideo = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, teachername, category, subCategory } = req.body;

    if (
      ![title, description, teachername, category, subCategory].every(
        (field) => field && field.trim()
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingVideo = await VideoModel.findByPk(id);
    if (!existingVideo) {
      throw new ApiError(404, "Video not found");
    }

    const updatedVideo = req.file?.path;

    if (updatedVideo) {
      const cloudinaryResponse = await uploadOnCloudinary(updatedVideo);

      existingVideo.videourl = cloudinaryResponse.secure_url;
    } else {
      res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    existingVideo.title = title;
    existingVideo.description = description;
    existingVideo.teachername = teachername;
    existingVideo.category = category;
    existingVideo.subCategory = subCategory;

    await existingVideo.save();

    return res.status(200).json({ message: "Video updated successfully" });
  } catch (err) {
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

    const video = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await video.increment("likeVideo");

    // Create a like entry for the user and the video
    await Like.create({
      userId: userId,
      videoId: videoId,
    });

    return res.status(200).json({
      like: video.likeVideo, // Assuming 'likeVideo' is the attribute storing the like count in your VideoModel
    });
  } catch (err) {
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
    res.status(500).json({ error: "Internal server error" });
  }
};

const getReport = asyncHandler(async (req, res) => {
  try {
    const totalUser = await Users.count();
    const totalVideo = await VideoModel.count();

    const videoWithMaxViews = await VideoModel.findOne({
      order: [["views", "DESC"]],
    });
    const videoWithMaxLike = await VideoModel.findOne({
      order: [["likeVideo", "DESC"]],
    });

    const totalLike = await VideoModel.sum("likeVideo");
    const totalViews = await VideoModel.sum("views");

    console.log("totalviews", totalViews);

    res.status(200).json({
      totaluser: totalUser,
      totalVideo: totalVideo,
      mostViews: videoWithMaxViews,
      videoWithMaxViews: videoWithMaxViews,
      totalLike: totalLike,
      totalViews: totalViews,
    });
  } catch (err) {
    res.status(500).json({ message: "Internaal server error", Error: err });
  }
});

const getVideo = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  console.log("videoId", videoId);

  try {
    if (!videoId) {
      res.status(500).json({ mesage: "Sorry to find the Video" });
    }
    const video = await VideoModel.findOne({
      where: {
        id: videoId,
      },
    });
    res.status(200).json({ mesage: "Success", video: video });
  } catch (err) {
    res.status(404).json({ message: "Internal server error" });
  }
});

export {
  getVideo,
  getReport,
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

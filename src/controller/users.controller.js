import { Users } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandlers.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudnary.js";

const secretKey = "dasdas";
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if ([username, password, email].some((result) => result?.trim() == "")) {
      throw new ApiError(400, "All fields are required");
    } else {
      const existindUser = await Users.findOne({
        where: {
          email: email,
        },
      });

      if (existindUser) {
        throw new ApiError(409, "user with email already exists");
      }

      const imageFile = req.file?.path;

      if (!imageFile) {
        throw new ApiError(400, "video and image file is required");
      }

      const cloudinaryResponse = await uploadOnCloudinary(imageFile);
      console.log(cloudinaryResponse);

      if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
      }

      const user = await Users.create({
        username: username,
        email: email,
        password: password,
        imageurl: cloudinaryResponse.secure_url,
      });

      if (!user) {
        throw new ApiError(500, "Registration failed failed");
      }

      return res.status(201).json({ message: " successfully" });
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    res
      .status(err.status || 500)
      .json({ message: "Sorry, failed to  register user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("emai", email);

    const user = await Users.findOne({ where: { email, password } });

    if (user.email == email && user.password == password) {
      jwt.sign({ user }, secretKey, (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({
          message: "login Successful",
          token,
          isAdmin: user.isAdmin,
          profile: user.id,
        });
      });
    } else {
      return res.json("unvalid user or password");
    }
  } catch (error) {
    res.status(500).json("somenthing went wrong");
  }
});
const userProfile = asyncHandler(async (req, res) => {
  const ID = req.user;
  const userId = ID.user.id;

  try {
    const user = await Users.findOne({ where: { id: userId } });

    console.log("User data:", user);

    res.status(200).json({ message: "User data", user: user });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const editUserProfile = asyncHandler(async (req, res) => {
  const ID = req.user;
  const userId = ID.user.id;

  const { username, password, email } = req.body;

  try {
    const user = await Users.findOne({ where: { id: userId } });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if any provided fields are empty
    if (
      [username, password, email].some(
        (field) => field !== undefined && field.trim() === ""
      )
    ) {
      throw new ApiError(400, "Fields cannot be empty");
    }

    if (username !== undefined) {
      user.username = username;
    }

    if (email !== undefined) {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        res.status(500).json({ message: "user with email already exist" });
      }
      user.email = email;
    }

    if (password !== undefined) {
      user.password = password;
    }

    if (req.file && req.file.path) {
      const imageFile = req.file.path;
      const cloudinaryResponse = await uploadOnCloudinary(imageFile);

      if (!cloudinaryResponse) {
        res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }

      user.imageurl = cloudinaryResponse.secure_url;
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error editing user profile:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Failed to edit user profile" });
  }
});

export { registerUser, loginUser, userProfile, editUserProfile };

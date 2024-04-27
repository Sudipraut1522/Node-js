import { Users } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandlers.js";
import jwt from "jsonwebtoken";

const secretKey = "dasdas";
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log("emial", email);

  if (
    ![email, username, password].every((field) => field && field.trim() !== "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists
  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create the user
  const newUser = await Users.create({
    email: email,
    password: password,
    username: username.toLowerCase(),
  });

  if (!newUser) {
    throw new ApiError(500, "User registration failed");
  }

  // User registration successful
  return res.status(201).json({ message: "User registered successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("emai", email);

    const user = await Users.findOne({ where: { email, password } });

    if (user.email == email && user.password == password) {
      jwt.sign({ user }, secretKey, { expiresIn: "400s" }, (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res
          .status(200)
          .json({ message: "login Successful", token, isAdmin: user.isAdmin });
      });
    } else {
      return res.json("unvalid user or password");
    }
  } catch (error) {
    res.status(500).json("somenthing went wrong");
  }
});

const tokenChecked = asyncHandler(async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(500).json({ message: "sorry to find a token" });
    }
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    res.status(200).json({ user: decoded });
  } catch (err) {
    console.log(err);
  }
});

export { registerUser, loginUser };

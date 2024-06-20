import { Users } from "../models/users.models.js";
import { asyncHandler } from "../utils/asynchandlers.js";

const isApproved = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  console.log("userID", userId);

  try {
    const user = await Users.findOne({
      where: {
        id: userId,
      },
    });

    console.log("userDetail", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isApproved = true;

    await user.save();

    res.status(200).json({ message: "User has been approved" });
  } catch (err) {
    console.error("Error in approving user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { isApproved };

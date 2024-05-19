// Import necessary modules and models
import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Users } from "./users.models.js";
import { VideoModel } from "./video.model.js";

// Define the WatchHistory model
const WatchHistory = sequelize.define("WatchHistory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Consider whether userId should be allowNull: false based on your requirements
    references: {
      model: Users,
      key: "id",
    },
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Consider whether videoId should be allowNull: false based on your requirements
    references: {
      model: VideoModel,
      key: "id",
    },
  },
  watchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

WatchHistory.belongsTo(Users, { foreignKey: "userId" });
WatchHistory.belongsTo(VideoModel, { foreignKey: "videoId" });

export const syncWatchHistory = async () => {
  try {
    await WatchHistory.sync({ alter: true });
    console.log("WatchHistory table synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing WatchHistory table:", error);
  }
};

export { WatchHistory };

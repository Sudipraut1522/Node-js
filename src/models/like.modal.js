import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Users } from "./users.models.js";
import { VideoModel } from "./video.model.js";

const Like = sequelize.define("Like", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: VideoModel,
      key: "id",
    },
  },
});

// Define associations after models are imported
Like.belongsTo(Users, { foreignKey: "userId" }); // Corrected foreign key
Like.belongsTo(VideoModel, { foreignKey: "videoId" }); // Corrected foreign key

export const liketabel = async () => {
  try {
    await Like.sync({ alter: true });
    console.log("Like table created successfully.");
  } catch (error) {
    console.error("Error creating Like table:", error);
  }
};

export { Like };

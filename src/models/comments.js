import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Users } from "./users.models.js";
import { VideoModel } from "./video.model.js";

const Comments = sequelize.define("Comments", {
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
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations after models are imported
Comments.belongsTo(Users, { foreignKey: "userId" }); // Corrected foreign key
Comments.belongsTo(VideoModel, { foreignKey: "videoId" }); // Corrected foreign key

export const commentTabe = async () => {
  try {
    await Comments.sync({ alter: true });
    console.log("Comment table created successfully.");
  } catch (error) {
    console.error("Error creating Comment table:", error);
  }
};

export { Comments };

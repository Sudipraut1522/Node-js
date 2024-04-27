// User.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db/index.js";
const VideoModel = sequelize.define("Video", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teacher: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherimages: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Video table created successfully.");
  } catch (error) {
    console.error("Error creating User table:", error);
  }
})();

export { VideoModel };

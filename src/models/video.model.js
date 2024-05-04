// User.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db/index.js";
const VideoModel = sequelize.define("Video", {
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videourl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachername: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  views: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Video table created successfully.");
  } catch (error) {
    console.error("Error creating video table:", error);
  }
})();

export { VideoModel };

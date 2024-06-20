// User.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
const Users = sequelize.define("Register", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    lowercase: true,
    trim: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isAdmin: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  imageurl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("User table created successfully.");
  } catch (error) {
    console.error("Error creating User table:", error);
  }
})();

export { Users };

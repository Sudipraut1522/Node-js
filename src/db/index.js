import Sequelize from "sequelize";

const sequelize = new Sequelize("NEXT", "sudip", "sudip", {
  host: "localhost",
  dialect: "postgres",
});

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connect successful `);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export { dbConnection, sequelize };

import mongoose from "mongoose";
import { dbName } from "../constant.js";

export const dbConnection = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI||4000}/${dbName}`
    );

    console.log("Connected to database: " + connectionInstance.connection.host);
  } catch (error) {
    console.log("database connection error at db file: " + error.message);
    process.exit(1);
  }
};

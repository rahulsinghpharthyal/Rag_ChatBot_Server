import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    const res = await mongoose.connect(url);
    return res.connection.host;
  } catch (error) {
    throw error; // important → allows server.js to catch it
  }
};

export default connectDB;
  
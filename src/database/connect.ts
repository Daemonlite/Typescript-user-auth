import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    // the ! is used to show that it can be either a string or undefined
    const con = await mongoose.connect(process.env.MONGO_URI!);
    console.log('DB CONNECTED');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
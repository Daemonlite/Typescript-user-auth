import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary'; 
import connectDb from './database/connect';
import userRoutes from './routes/userRoutes';
dotenv.config();
const port = 7000;
const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//db
connectDb()

//routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`SERVER ACTIVE ON PORT ${port}`);
});


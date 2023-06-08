import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';


interface RegisterRequestBody {
  fullName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  profile: string;
  isVerified?: boolean;
  isBanned?: boolean;
  location?: string;
  bio?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Add a return statement to exit the function after sending the response
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  };
const register = async (req: Request, res: Response): Promise<void> => {
  const {
    fullName,
    email,
    password,
    isAdmin,
    profile,
    isVerified,
    isBanned,
    location,
    bio,
  } = req.body as RegisterRequestBody;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ message: "Please provide all required fields" });
  }

  // Validate password
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password should contain at least 1 symbol, 1 number, and be at least 8 characters long",
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res
      .status(400)
      .json({ message: "A user with this email already exists" });
  }

  // Upload profile image

  
  let profileImageUrl: string | undefined; // Initialize with undefined
  try {
    const result = await cloudinary.uploader.upload(profile);
    profileImageUrl = result.secure_url;
  } catch (error: any) {
    console.error(error);
     res.status(400).json({ message: "Failed to upload profile image" });
     return
  }
  
  if (!profileImageUrl) {
     res.status(400).json({ message: "Failed to upload profile image" });
     return
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    profile: profileImageUrl,
    isAdmin,
    isVerified,
    isBanned,
    location,
    bio,
    subscribers: [],
    polls: [],
  });
  

  const token = jwt.sign(
    { fullName: user.fullName, id: user._id, isAdmin: user.isAdmin },
    process.env.SECRET || 'hesdfuytdrtjryjy',
    {
      expiresIn: "2d",
    }
  );

  try {
    await user.save();
    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};




const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginRequestBody;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return
    }

    if (password === undefined) {
      res.status(400).json({ message: "Password is required" });
      return
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(400).json({ message: "Invalid user credentials" });
      return 
    }

    const token = jwt.sign(
      { fullName: user.fullName, id: user._id },
      process.env.SECRET || 'hesdfuytdrtjryjy',
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      ...user.toObject(),
      token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
};


const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.SECRET || 'hesdfuytdrtjryjy', {
    expiresIn: "2d",
  });
};

const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedInfo = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedInfo, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user info" });
  }
};


const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
    return;
  }
};

export {
  getUsers,
  register,
  loginUser,
  deleteUser,
  updateUserInfo,
  getUserById,
  generateToken,
};
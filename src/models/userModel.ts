import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  fullName?: string;
  email?: string;
  bio?: string;
  password?: string;
  profile?: string;
  location?: string;
  isAdmin?:boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    isAdmin:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;


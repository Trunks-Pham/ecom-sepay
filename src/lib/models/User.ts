import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  avatar?: string;
  isAdmin: boolean;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    avatar: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'Vietnam',
    },
    zipCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;

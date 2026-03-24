import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    googleId: { type: String },
    name: { type: String, },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String  },
    termsAccepted: { type: Boolean },
    subscribeNewsletter: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    picture: { type: String, default: '' },
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date,
    emailVerifyToken: String,
    emailVerifyTokenExpires: Date
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
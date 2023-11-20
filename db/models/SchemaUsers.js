import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verifyEmail: {
    value: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: new Date(),
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  token: {
    value: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: new Date(),
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;

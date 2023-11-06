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

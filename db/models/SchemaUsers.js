import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifyEmail:{
    value: {
      type: String,
    },
    date: {
      type: String,
      default: new Date()
    }
  },
  token: {
    value: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: new Date()
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;

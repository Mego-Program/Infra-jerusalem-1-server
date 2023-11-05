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
    type: String,
  },
  token: {
    value: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: new Date().toLocaleString()
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;

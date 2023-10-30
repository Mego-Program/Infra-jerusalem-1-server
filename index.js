import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./db/dbCoonect.js";

// get the port from the env or is 5050
const port = process.env.PORT || 5050;
// connect fron the env file.
dotenv.config();


const app = express();

// connect to the DB
connectDB();

// chack if the DB is connect.
mongoose.connection.once("open", () => {
  console.log("connect to the DB");
});

app.listen(port, () => {
  console.log("the server is listening in port " + port);
});

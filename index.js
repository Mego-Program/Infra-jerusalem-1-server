import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/dbCoonect.js";

// impurt the routers.
import routerAuth from "./routers/routerAuth.js";
import routerPrivet from "./routers/routerPrivet.js";
import routerForgetPassword from "./routers/routerForgetPassword.js";


// connect fron the env file.
dotenv.config();
// get the port from the env or is 5050
const port = process.env.PORT || 5050;

const app = express();
app.use(express.json());

app.use(cors());

// connect to the DB
connectDB();
// send to the router.
app.use("/users", routerAuth);
app.use("/privet", routerPrivet);
app.use("/forgetPassword", routerForgetPassword);

// chack if the DB is connect.
mongoose.connection.once("open", () => {
  console.log("connect to the DB");
});

app.listen(port, () => {
  console.log("the server is listening in port " + port);
});

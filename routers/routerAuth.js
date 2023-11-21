import express from "express";
import { getRowsfromAllUsers } from "../db/functionToDB.js";
const router = express.Router();
import { check } from "express-validator";

// to use the env file.
import dotenv from "dotenv";
dotenv.config();

import loginFunction from "../controllers/routerAuth/login.js";
import verifyEmailfunction from "../controllers/routerAuth/verifyEmailCode.js";
import emailFanction from "../controllers/routerAuth/getPassOrCodeEmail.js";
import signupFunction from "../controllers/routerAuth/signup.js";
import usernameFunction from "../controllers/routerAuth/usernameUesd.js";
import tokenFunction from '../controllers/routerAuth/checkToken.js'

router.post("/verifyEmail", verifyEmailfunction);
router.post("/email", emailFanction);
router.post("/login", loginFunction);
router.post(
  "/signup",
  // add a middelwer to ckeck if the information is good.
  [
    check("email", "email is not a email").isEmail(),
    check("password", "password is not strong").isStrongPassword(),
  ],
  signupFunction
);
router.post("/username", usernameFunction);
router.post("/token", tokenFunction);
router.get('/', async (req, res) => {
  const response = await getRowsfromAllUsers("email username image")
  res.json(response)
})


export default router;

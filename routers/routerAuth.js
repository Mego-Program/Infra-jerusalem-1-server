import express from "express";
import cors from "cors";
const router = express.Router();
import { check, validationResult } from "express-validator";
import { addToDB, allDB, getOneUser } from "../db/functionToDB.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
// to use the env file.
import dotenv from "dotenv";
dotenv.config();

router.post("/verifyEmail", async (req, res) => {
  const { email, code } = req.body;
  console.log(email,code);
  const user = await getOneUser({ email: email, verifyEmail: code });
  if (!user) {
    return res.status(400).json({
      errors: {
        msg: "code error",
      },
    });
  } else {
    //send the token.
    return res.status(200).json({ token: user.token.value });
  }
});

router.post("/login", async (req, res) => {
  // get the user name and the password.
  const { email, password } = req.body;
  // check if the user is in the DB.
  let user = await getOneUser({ email: email });

  // if it's empty it's send a erorr.
  if (!user) {
    return res.status(400).json({
      errors: {
        msg: "Invalid Credentials",
      },
    });
  }
  // check if the password is corecct.
  let corectPassword = await bcrypt.compare(
    password,
    await bcrypt.hash(user.password, 10)
  );
  // if it's not a corect password it's send a eroor.
  if (!corectPassword) {
    return res.status(400).json({
      errors: {
        msg: "Invalid Credentials",
      },
    });
  }
  // creat a token with the email inside.
  const token = JWT.sign(
    {
      email,
    },
    process.env.SICRET_KEY_TOKEN,
    {
      expiresIn: 3600000,
    }
  );
  // send the token.
  res.json({
    token,
  });
});
router.post(
  "/signup",
  // add a middelwer to ckeck if the information is good.
  [
    check("email", "email is not a email").isEmail(),
    check("password", "password is not strong").isStrongPassword(),
  ],
  async (req, res) => {
    // get the erorrs in the check middelwer.
    const errors = validationResult(req);
    // If there is an erorr.
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // get the argomants.
    const { firstName, lastName, email, username, password } = req.body;
    //check if there is a user like this.
    const userExists = await getOneUser({ email: email });
    console.log(userExists);
    // if there is a user like this send erorr.
    if (userExists) {
      return res.status(400).json({
        errors: {
          msg: "This user is already exists",
        },
      });
    }
    // create a hash password.
    let hashePassword = await bcrypt.hash(password, 10);
    // create a token.
    const token = JWT.sign(
      {
        email,
      },
      process.env.SICRET_KEY_TOKEN,
      {
        expiresIn: 3600000,
      }
    );
    // add to the DB.
    const resultAddUser = await addToDB({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hashePassword,
      verifyEmail: Math.floor(Math.random() * 90000) + 10000,
      token: { value: token, date: new Date().toLocaleString() },
    });
    console.log(resultAddUser);
    if (resultAddUser == true) {
      // Send the token.
      return res.status(200).json({
        msg: true,
      });
    } else {
      return res.status(400).json({
        errors: {
          msg: "erorr in the DB",
        },
      });
    }
  }
);

export default router;

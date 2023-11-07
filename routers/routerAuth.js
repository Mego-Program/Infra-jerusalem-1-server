import express from "express";
import calculateDateDifference from "../functins/calculateDateDifference.js";

const router = express.Router();
import { check, validationResult } from "express-validator";
import {
  addToDB,
  allDB,
  getOneUser,
  updeteOneUser,
} from "../db/functionToDB.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
// to use the env file.
import dotenv from "dotenv";
import sendEmail from "../middleware/sendEmailToTheClient.js";
dotenv.config();

// send a email to the client to verify the email.
router.post("/verifyEmail", async (req, res) => {
  const { email, code } = req.body;
  // get the user from the DB.
  const user = await getOneUser({ email: email, "verifyEmail.value": code });
  if (!user) {
    return res.status(400).json({
      errors: {
        msg: "code error",
      },
    });
  } else {
    const diffTime = calculateDateDifference(
      new Date(user.verifyEmail.date),
      new Date()
    );
    if (diffTime.hours != 0 || diffTime.minutes > 2) {
      return res.status(400).json({
        mag: "time of the code is over",
      });
    }

    try {
      const reqSaveDB = await updeteOneUser(email, {
        "verifyEmail.verify": true,
      });
      if (!reqSaveDB) {
        return res.status(400).json({
          mag: "error in DB",
        });
      }
    } catch (error) {
      return res.status(400).json({
        mag: "error in DB",
      });
    }
    //send the OK.
    return res.status(200).json({ msg: "email verify" });
  }
});

router.post("/login", async (req, res) => {
  // get the user name and the password.
  const { email, password } = req.body.sendData;
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
  if (!user.verifyEmail.verify) {
    return res.status(400).json({
      errors: {
        msg: "the email is not varify",
      },
    });
  }
  // check if the password is corecct.
  let corectPassword = await bcrypt.compare(password, user.password);
  // if it's not a corect password it's send a eroor.
  if (!corectPassword) {
    return res.status(400).json({
      errors: {
        msg: "Invalid Credentials",
      },
    });
  }
  const diffTime = calculateDateDifference(
    new Date(user.verifyEmail.date),
    new Date()
  );
  if (user.token.value != "" && diffTime.hours < 720) {
    res.json({
      token: user.token.value,
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
  try {
    const reqSaveDB = await updeteOneUser(email, {
      "token.value": token,
      "token.date": new Date(),
    });
    if (!reqSaveDB) {
      return res.status(400).json({
        mag: "error in DB",
      });
    }
  } catch (error) {
    return res.status(400).json({
      mag: "error in DB",
    });
  }
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
    if (userExists && userExists.verifyEmail.verify == false) {
      return res.status(400).json({
        errors: {
          msg: "the email is not verify",
        },
      });
    }
    // if there is a user like this send erorr.
    if (userExists && userExists.verifyEmail.verify == true) {
      return res.status(400).json({
        errors: {
          msg: "one of the information is error",
        },
      });
    }
    // add to the DB.
    const resultAddUser = await addToDB({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: " ",
    });
    if (!resultAddUser) {
      return res.status(400).json({
        errors: {
          msg: "erorr in the DB",
        },
      });
    }

    // create a hash password.
    let hashePassword = await bcrypt.hash(password, 10);
    // creat a rundom code of 5 numbers.
    const verifyCode = Math.floor(Math.random() * 90000) + 10000;
    // add to the DB.
    const resultUpdateUser = await updeteOneUser(email, {
      password: hashePassword,
      verifyEmail: { value: verifyCode, date: new Date(), verify: false },
    });
    // send the email to the user.
    const reqEmail = await sendEmail(email, verifyCode);
    if (resultUpdateUser == true && reqEmail == true) {
      // Send the ok the send a email.
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

router.post("/username", async (req, res) => {
  // get the userName.
  const userName = req.body.Name;
  // check if the username is in the DB.
  try {
    let user = await getOneUser({ username: userName });
    if (!user) {
      return res.status(200).json({ msg: "Not exist" });
    } else {
      return res.status(400).json({ msg: "exist" });
    }
  } catch (error) {
    return res.status(200).json({ msg: "Not exist" });
  }
});

export default router;

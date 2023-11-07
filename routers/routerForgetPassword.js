import { Router } from "express";
import sendEmail from "../middleware/sendEmailToTheClient.js";
import { getOneUser, updeteOneUser } from "../db/functionToDB.js";
import calculateDateDifference from "../functins/calculateDateDifference.js";
import bcrypt from "bcrypt";
import randomPassword from "../functins/randomPassword.js";

const router = Router();

router.post("/email", async (req, res) => {
  // get the email address.
  const { email } = req.body;
  // check if there is a user like the email.
  const user = await getOneUser({ email: email });
  // if not it's a error.
  if (!user) {
    return res.status(400).json({
      mag: "erorr email not found",
    });
  }
  // try to update the code and send it to the email.
  try {
    //creat a rundom code.
    const verifyPassword = randomPassword();
    // send a email to the cloent.
    const reqEmail = await sendEmail(email, verifyPassword);
    // if the is not send a email send error.
    if (!reqEmail) {
      return res.status(400).json({
        mag: "error send email",
      });
    }
    // save the changes.
    const resSave = await updeteOneUser(email, {
      "verifyEmail.value": verifyPassword,
      "verifyEmail.date": new Date(),
    });
    console.log(resSave);
    if (!resSave) {
      return res.status(400).json({
        mag: "error in DB",
      });
    }
    // send is good.
    else {
      return res.status(200).json({
        mag: "the email sended",
      });
    }
  } catch (error) {
    return res.status(400).json({
      mag: error,
    });
  }
});

router.post("/password", async (req, res) => {
  // get the code and the email
  const { email, password } = req.body;
  // check if the code is corect.
  const user = await getOneUser({
    email: email,
    "verifyEmail.value": password,
  });
  // if is not foud send error.
  if (!user) {
    return res.status(400).json({
      mag: "not a corect code",
    });
  }
  const diffTime = calculateDateDifference(
    new Date(user.verifyEmail.date),
    new Date()
  );
  console.log(diffTime);
  if (diffTime.hours > 0 || diffTime.minutes > 5) {
    return res.status(400).json({
      mag: "time of the password is over",
    });
  }
  try {
    // update the DB.
    const saveDB = await updeteOneUser(email, {
      password: await bcrypt.hash(password, 10),
    });
    if (!saveDB) {
      return res.status(400).json({
        mag: "error in DB",
      });
    } else {
      // Send OK to the client with the code.
      return res.status(200).json({
        code: "change the password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      mag: error,
    });
  }
});

export default router;

import { Router } from "express";
import sendEmail from "../middleware/sendEmailToTheClient.js";
import { getOneUser } from "../db/functionToDB.js";
import JWT from "jsonwebtoken";

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
    const verifyCode = Math.floor(Math.random() * 90000) + 10000;
    user.code = verifyCode;
    // save the changes.
    user.save();
    // send a email to the cloent.
    const reqEmail = await sendEmail(email, verifyCode);
    // if the is not send a email send error.
    if (!reqEmail) {
      return res.status(400).json({
        mag: "error send email",
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

router.post("/code", async (req, res) => {
  // get the code and the email
  const { email, code } = req.body;
  // check if the code is corect.
  const user = await getOneUser({ email: email, code: code });
  // if is not foud send error.
  if (!user) {
    return res.status(400).json({
      mag: "not a corect code",
    });
  }
  try {
    // creat a code.
    const verifyCodeClient = Math.floor(Math.random() * 90000) + 10000;
    user.code = verifyCodeClient;
    // save the changes.
    user.save();
    // Send OK to the client.
    return res.status(200).json({
      mag: "the email sended",
    });
  } catch (error) {
    return res.status(400).json({
      mag: error,
    });
  }
});

router.post("/changgPassword", async (req, res) => {
    // Get the email, password, code.
  const { email, password, code } = req.body;
  // check if the code is corect.
  const user = await getOneUser({ email: email, code: code });
  // If is not find a user send a error
  if (!user) {
    return res.status(400).json({
      mag: "user is not found",
    });
  }

  try {
    // create a token
    const token = JWT.sign({ email }, process.env.SICRET_KEY_TOKEN, {
      expiresIn: 3600000,
    });
    // update the DB.
    user.token.value = token;
    user.token.date = new Date.toLocaleString();
    user.password = password;
    // save th changes.
    user.save();
    return res.status(200).json({
      token: token,
    });
  } 
  // send the error.
  catch (error) {
    return res.status(400).json({
      mag: error,
    });
  }
});

export default router;

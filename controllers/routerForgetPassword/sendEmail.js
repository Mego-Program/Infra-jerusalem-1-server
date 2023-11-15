import sendEmail from "../../middleware/sendEmailToTheClient.js";
import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";

import randomPassword from "../../functins/randomPassword.js";

const emailFunction = async (req, res) => {
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
};

export default emailFunction;

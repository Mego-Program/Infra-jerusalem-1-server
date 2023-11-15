import randomPassword from "../../functins/randomPassword.js";
import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";
import sendEmail from "../../middleware/sendEmailToTheClient.js";

const emailFanction = async (req, res) => {
  const { email, type } = req.body;
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
  // creat a rundom code of 5 numbers.
  let verifyCode = Math.floor(Math.random() * 90000) + 10000;
  if (type == "password") {
    verifyCode = randomPassword();
  }
  // add to the DB.
  const resultUpdateUser = await updeteOneUser(email, {
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
};
export default emailFanction;

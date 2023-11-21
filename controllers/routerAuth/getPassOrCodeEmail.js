import randomPassword from "../../functins/randomPassword.js";
import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";
import sendEmail from "../../middleware/sendEmailToTheClient.js";

const emailFanction = async (req, res) => {
  const { email, type } = req.body;
  let user = await getOneUser({ email: email });
  if (!user) {
    return res.status(400).json({
      errors: {
        msg: "Invalid Credentials",
      },
    });
  }
  let verifyCode = Math.floor(Math.random() * 90000) + 10000;
  if (type == "password") {
    verifyCode = randomPassword();
  }
  const resultUpdateUser = await updeteOneUser(email, {
    verifyEmail: { value: verifyCode, date: new Date(), verify: false },
  });
  const reqEmail = await sendEmail(email, verifyCode);
  if (resultUpdateUser == true && reqEmail == true) {
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

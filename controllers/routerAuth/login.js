import calculateDateDifference from "../../functins/calculateDateDifference.js";
import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


const loginFunction = async (req, res) => {
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
  const sendInformtionUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  if (user.token.value != "" && diffTime.hours < 720) {
    return res.status(200).json({
      token: user.token.value,
      user: sendInformtionUser,
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
  res.status(200).json({
    token: token,
    user: sendInformtionUser,
  });
};

export default loginFunction;

import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";
import calculateDateDifference from "../../functins/calculateDateDifference.js";
import bcrypt from "bcrypt";

const passwordFunction = async (req, res) => {
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
    let hashePassword = await bcrypt.hash(password, 10);

    // update the DB.

    const saveDB = await updeteOneUser(email, {
      password: hashePassword,
      "verifyEmail.verify": true,
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
};

export default passwordFunction;

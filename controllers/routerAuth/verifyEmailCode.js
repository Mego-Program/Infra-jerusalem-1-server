import calculateDateDifference from "../../functins/calculateDateDifference.js";

import { getOneUser, updeteOneUser } from "../../db/functionToDB.js";

const verifyEmailfunction = async (req, res) => {
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
};
export default verifyEmailfunction;

import { getOneUser } from "../../db/functionToDB.js"; 

const tokenFunction = async (req, res) => {
  try {
    const { token } = req.body;
    let user = await getOneUser({ "token.value": token });
    if (user) {
      return res.status(200).json({ msg: "Token is good" });
    } else {
      return res.status(400).json({ msg: "Token is not good" });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Token is not good" });
  }
};

export default tokenFunction;

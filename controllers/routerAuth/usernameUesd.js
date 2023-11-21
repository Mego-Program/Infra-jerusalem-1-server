import { getOneUser } from "../../db/functionToDB.js";

const usernameFunction = async (req, res) => {
  const userName = req.body.Name;
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
};

export default usernameFunction;

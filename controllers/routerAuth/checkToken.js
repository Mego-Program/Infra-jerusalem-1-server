import { getOneUser } from "../../db/functionToDB.js"; 

async function checkIfGoodToken(token){
  try {
    let user = await getOneUser({ "token.value": token });
    if (user) {
      return true
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}


const tokenFunction = async (req, res) => {
  const { token } = req.body;
  if (checkIfGoodToken(token)){
    return res.status(200).json({ msg: "Token is good" });
  } else {
    return res.status(400).json({ msg: "Token is not good" });

  }
};

export default tokenFunction;

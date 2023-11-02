import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (req, res, next) => {
  //get the token from the user.
  const token = req.header("x-auth-token");
  //check if the is a token.
  if (!token) {
    return res.status(400).json({
      errors: {
        msg: "No token found",
      },
    });
  }
  // check if the token is validity.
  try {
    let user = await JWT.verify(token, process.env.SICRET_KEY_TOKEN);
    // It's move to the next function.
    next();
  } catch (error) {
    // else sent a erorr.
    return res.status(400).json({
      errors: {
        msg: "Token invalud",
      },
    });
  }
};

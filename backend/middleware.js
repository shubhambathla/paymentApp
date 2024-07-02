const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const app = express();

const authMiddleware = (req, res, next) => {
  const tokenLoad = req.headers.authorization;
  if (!tokenLoad || !tokenLoad.startsWith("Bearer ")) {
    //Checks the headers for an Authorization header Bearer <token>
    return res.status(403).json({
      message: "Invalid Token",
    });
  }
  const token = tokenLoad.split(" ")[1];
  try {
    const tokenVerify = jwt.verify(token, JWT_SECRET); //Verifies that the token is valid
    req.userId = tokenVerify.userId; //Puts the userId in the request object if the token checks out.
    next();
  } catch (err) {
    return res.status(403).json({});
  }
};

module.exports = {
  authMiddleware,
};

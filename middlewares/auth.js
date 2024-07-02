const httpStatus = require("http-status");
const ApiError = require("../errors/ApiError");
const jwt = require("jsonwebtoken");

const auth =(...roles) =>async (req, res, next) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      if (tokenWithBearer && tokenWithBearer.startsWith("Bearer")) {
        const token = tokenWithBearer.split(" ")[1];

        //verify token
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        //add user to headers
        req.user = verifyUser;
        const { role } = verifyUser;

        //guard user
        if (roles.length && !roles.includes(role)) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "You don't have permission to access this resource"
          );
        }
        next();
      }
    } catch (error) {
      next(error);
    }
  };

module.exports = auth;

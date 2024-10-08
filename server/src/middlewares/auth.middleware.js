import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

// Role-based middleware
export const authMiddleware = (allowedRoles = []) => {
  if (typeof allowedRoles === "string") allowedRoles = [allowedRoles];
  return AsyncHandler(async (req, res, next) => {
    // Get token from cookies or authorization header
    // const token =

    //   req.cookies?.accessToken ||
    //   req?.header("authorization")?.replace("Bearer", "").trim();
    const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
    console.log(token);

    // Check if token is missing
    if (!token) {
      return next(new ApiError(403, "Unauthorized user, Access denied"));
    }

    // Verify token
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    // Check if token is valid
    if (!decodedToken) {
      return next(new ApiError(403, "Unauthorized user access"));
    }

    // Fetch the user associated with the token
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    // Check if user exists
    if (!user) {
      return next(new ApiError(403, "User not found, please log in"));
    }
    console.log(allowedRoles, user.role);
    // Check if user role is allowed
    if (!allowedRoles.includes(user.role)) {
      return next(new ApiError(403, "Access denied, insufficient permissions"));
    }

    // Attach user to request object for further use
    req.user = user;

    next();
  });
};

import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import db from "../config/db.js";


const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")?.trim();

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Use the correct env variable name
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Assuming you sign your token with { userId: user.user_id }
    const [results] = await db.query(
      "SELECT user_id, name, email FROM Users WHERE user_id = ?",
      [decodedToken.userId]
    );

    if (results.length === 0) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = results[0]; // Attach user to request (note field is user_id)
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
});


export default verifyJWT;


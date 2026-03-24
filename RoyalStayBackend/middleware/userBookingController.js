// =============================================================================
// JWT MIDDLEWARE FOR USER EXTRACTION
// =============================================================================

import jwt from "jsonwebtoken";
export const getUserToken = (req, res, next) => {
  console.log("getUserToken middleware - Headers:", req.headers);
  console.log("getUserToken middleware - Cookies:", req.cookies);
  
  try {
    // Try to get token from cookies
    let token =
      req.cookies?.token ||
      req.cookies?.jwt ||
      req.cookies?.UserToken;

    console.log("Found token in cookies:", token);

    // If not in cookies, check Authorization header
    if (!token && req.headers["authorization"]) {
      const authHeader = req.headers["authorization"];
      console.log("Authorization header:", authHeader);
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        console.log("Found token in Authorization header:", token);
      }
    }

    // If still no token, deny access
    if (!token) {
      console.log("No token found anywhere");
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token decoded successfully:", decoded);

    next();
  } catch (error) {
    console.log("Token verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
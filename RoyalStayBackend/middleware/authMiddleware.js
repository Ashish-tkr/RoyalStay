// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = (req, res, next) => {
  const token = req.cookies.UserToken;
  if (!token) {
    return res.status(401).json({ message: " You are Unauthorized ", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

// optional role middleware
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden", success: false });
  }
  next();
};


export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.UserToken;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user data from database
      const user = await UserModel.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      // Attach user to request object
      req.user = user;
      next();
      
    } catch (jwtError) {
      // Handle different JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      }

      throw jwtError;
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};


export const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // or throw error
  }
};


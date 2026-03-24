import { validationResult } from "express-validator";
import User from "../models/admin.js";
import { generateToken } from "../utils/generateToken.js";

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
  return res.json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user._id, 
        name: user.name,
        email: user.email,
        role: user.role },
  });
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};
import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const verifyToken = (UserToken) => {
  try {
    return jwt.verify(UserToken, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

const decodeToken = (UserToken) => {
  try {
    return jwt.decode(UserToken);
  } catch (error) {
    throw error;
  }
};

export { generateToken, verifyToken, decodeToken };

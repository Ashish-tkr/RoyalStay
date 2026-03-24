import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

// Upload single image
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.json({
      success: true,
      url: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

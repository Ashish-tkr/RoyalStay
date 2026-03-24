import dotenv from "dotenv";
import connectDB from "../models/db.js";
import Admin from "../models/admin.js";

dotenv.config(); // load .env

const run = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const name = process.env.ADMIN_NAME || "Admin";
    const password = process.env.ADMIN_PASSWORD || "change_me";

    let existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
    } else {
      const newAdmin = await Admin.create({ name, email, password, role: "admin" });
      console.log("✅ Admin created:", newAdmin.email);
    }
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  }
};

run();

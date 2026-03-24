import { signup, login, logout, forgotPassword, resetPassword, update_user } from '../Controllers/AuthController.js';
import { signupValidation, loginValidation } from '../middleware/AuthValidation.js';
import nodemailer from 'nodemailer';
import { Router } from 'express';
import  passport  from '../Controllers/auth.js';
import { createOrder, verifyPayment } from '../Controllers/paymentController.js';
import { googleCallback } from '../Controllers/AuthController.js';
import UserModel from '../models/User.js';
import bcrypt from "bcryptjs";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { verifyToken } from '../utils/generateToken.js';
import upload from '../middleware/upload.js';
//import { create } from 'axios';

const router = Router();

// ✅ Configure transporter once
const transporter = nodemailer.createTransport({
  service: "gmail", // Or Outlook, Yahoo, Zoho, etc.
  auth: {
    user: process.env.EMAIL_USER,  // Add in .env
    pass: process.env.EMAIL_PASS   // App password
  }
});


// ✅ Routes
router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/createOrder', createOrder);
router.post('/verifyPayment', verifyPayment);
router.get("/user", authMiddleware, async (req, res) => {
  try {
    // req.user.id should come from your auth middleware (e.g. JWT or session)
    const user = await UserModel.findById(req.user.id).select("name email");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false // Important: Disable sessions if using JWT
  }),
  googleCallback // Use your custom callback controller
);

// ✅ Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Store OTP in session 
    req.session.otp = otp;
    req.session.email = email;

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <div style="margin-bottom: 20px;">
                                    <h2 style="color: #333333; margin: 0;">Your Verification Code</h2>
                                </div>
                                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
                                    <p style="margin: 0; color: #666666; font-size: 16px;">Use the following OTP to complete your verification process. This code will expire in 10 minutes.</p>
                                    <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #495057;">
                                        ${otp}
                                    </div>
                                    <p style="margin: 0; color: #666666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                                </div>
                                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0; color: #999999; font-size: 12px;">This is an automated message, please do not reply.</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// /auth/forgot-password-otp
router.post("/forgot-otp", async (req, res) => {
  try {

    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in session
    req.session.otp = otp;
    req.session.email = email;

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP to reset password is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Debugging logs
  console.log("Verify OTP called");
  console.log("Request body:", req.body);
  console.log("Session at verify-otp:", req.session);

  if (!req.session.otp || !req.session.email) {
    return res.status(400).json({ success: false, message: "OTP expired or not found" });
  }

  if (req.session.email !== email) {
    return res.status(400).json({ success: false, message: "Email mismatch" });
  }

  if (req.session.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

    req.session.isForgotOtpVerified = true;
  res.json({ success: true, message: "OTP verified successfully" });

  // ✅ OTP valid → mark as verified
  req.session.isOtpVerified = true;
  req.session.email = email; // the verified email
  req.session.otp = null; // clear OTP

  // Explicitly save the session and wait for it to complete before responding
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  req.session.otp = null;

  res.json({ success: true, message: "OTP verified successfully" });
});


// /auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!req.session.isForgotOtpVerified || req.session.email !== email) {
    return res.status(403).json({ success: false, message: "OTP verification required" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserModel.findOneAndUpdate(
    { email },
    { password: hashedPassword }
  );

  // Clear session values
  req.session.otp = null;
  req.session.isForgotOtpVerified = false;

  res.json({ success: true, message: "Password reset successful" });
});

router.put("/profile", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware adds req.user
    const { name, phone, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // If file uploaded, add Cloudinary URL
    if (req.file) {
      updateData.avatar = req.file.path; // Cloudinary stores file path as URL
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Contact form route
router.post("/send-message", async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({ 
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password
      },
    });

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // send to yourself
  subject: `Contact Form: ${subject}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #2d3748;
          background-color: #f7fafc;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 12px;
          margin: 5px 0;
        }
        .label {
          font-weight: 600;
          color: #4a5568;
          text-align: right;
        }
        .value {
          color: #2d3748;
        }
        .message-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          line-height: 1.8;
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          color: #718096;
          border-top: 1px solid #e2e8f0;
        }
        .timestamp {
          font-size: 14px;
          color: #a0aec0;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300;">New Contact Form Submission</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Website Contact Form</p>
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">Contact Details</div>
            <div class="info-grid">
              <div class="label">Name:</div>
              <div class="value">${firstName} ${lastName}</div>
              
              <div class="label">Email:</div>
              <div class="value">
                <a href="mailto:${email}" style="color: #4299e1; text-decoration: none;">
                  ${email}
                </a>
              </div>
              
              <div class="label">Phone:</div>
              <div class="value">${phone || 'Not provided'}</div>
              
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Message</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This message was sent via your website contact form</p>
          <div class="timestamp">
            Received: ${new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `Contact form submission from ${firstName} ${lastName} (${email})`
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: subject || `New Contact from ${name} - Sirinilaya`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Contact - Sirinilaya</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3 style="color: #333;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea;">
              ${message}
            </div>
          </div>
          <div style="background: #333; color: white; padding: 10px; text-align: center; font-size: 12px;">
            <p>This email was sent from your Sirinilaya website contact form.</p>
          </div>
        </div>
      `
    };

    // Send confirmation email to user
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Sirinilaya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Thank You - Sirinilaya</h2>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Sirinilaya. We have received your message and will get back to you within 24 hours.</p>
            <p>We look forward to helping you discover exceptional stays where luxury meets tranquility.</p>
            <div style="margin: 20px 0; padding: 15px; background: #f8f9ff; border-radius: 5px;">
              <p><strong>Your Message:</strong></p>
              <p style="font-style: italic;">"${message}"</p>
            </div>
            <p>Best regards,<br>The Sirinilaya Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMail);

    res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});


    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

//router.post('/order',)

export default router;

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { generateState } from 'arctic';
import { generateToken } from '../utils/generateToken.js';
import passport from 'passport';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//Signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, termsAccepted, subscribeNewsletter } = req.body;

    if (!password || !phone) {
      return res.status(400).json({ message: "Password and phone are required", success: false });
    }

    // 👀 Debug session values
    console.log("Session at signup:", req.session);
    // Debugging logs
    console.log("Signup called");
    console.log("Request body:", req.body);

    // Step 2: Check if user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409)
        .json({ message: 'User is already exist, you can login', success: false });
    }

    // Step 3: Create new user
    const name = `${firstName} ${lastName}`;
    const userModel = new UserModel({ name: name, phone, email, password, termsAccepted, subscribeNewsletter });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    // Step 4: Send welcome email after successful registration
    try {
      const welcomeEmail = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to RoyalStay - Your Journey to Luxury Begins',
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
                        <!-- Header with Logo -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
                            <div style="display: inline-block; margin-bottom: 10px;">
                                <svg width="60" height="60" viewBox="0 0 400 400" style="filter: brightness(0) invert(1);">
                                    <g transform="translate(50, 50)">
                                        <g fill="white" stroke="white" stroke-width="3">
                                            <path d="M150 120 Q135 100, 120 120 Q135 80, 150 120 Q165 80, 180 120 Q165 100, 150 120"/>
                                            <path d="M80 80 Q70 65, 60 80 Q70 50, 80 80 Q90 50, 100 80 Q90 65, 80 80"/>
                                            <path d="M150 120 Q130 150, 120 200" fill="none" stroke-width="4"/>
                                            <path d="M80 80 Q70 110, 65 150" fill="none" stroke-width="3"/>
                                        </g>
                                        <polygon points="50,200 150,150 250,200 250,250 50,250" fill="white"/>
                                        <rect x="130" y="180" width="40" height="40" fill="#FFD700" rx="5"/>
                                        <path d="M50 200 Q30 180, 20 160 Q10 140, 30 120 Q50 100, 80 80" fill="none" stroke="white" stroke-width="3"/>
                                    </g>
                                    <text x="200" y="320" text-anchor="middle" font-size="24" font-weight="bold" fill="white">RoyalStay</text>
                                </svg>
                            </div>
                            <h1 style="margin: 0; font-size: 2.5em;">Welcome to RoyalStay</h1>
                            <p style="margin: 10px 0 0; font-size: 1.2em; opacity: 0.9;">Peaceful • Luxurious • Unforgettable</p>
                        </div>

                        <!-- Main Content -->
                        <div style="padding: 40px 30px; background: white;">
                            <h2 style="color: #667eea; margin-bottom: 20px;">Dear ${firstName},</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                                Welcome to RoyalStay, where luxury meets tranquility! We're thrilled to have you join our exclusive community of discerning travelers who appreciate the finest in hospitality.
                            </p>

                            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8eaff 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
                                <h3 style="color: #667eea; margin-bottom: 15px;">🏨 Discover Exceptional Stays</h3>
                                <p style="margin: 0; color: #555; line-height: 1.6;">
                                    From boutique hotels to exclusive villas, experience accommodations that redefine premium hospitality. 
                                    Each property in our collection is carefully curated for its unique character, exceptional service, 
                                    and ability to create lasting memories.
                                </p>
                            </div>

                            <h3 style="color: #667eea; margin: 30px 0 15px;">What makes RoyalStay special?</h3>
                            <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
                                <li><strong>Curated Properties:</strong> Handpicked accommodations that exceed expectations</li>
                                <li><strong>Personalized Service:</strong> Tailored experiences for every guest</li>
                                <li><strong>Authentic Culture:</strong> Immersive local experiences at each destination</li>
                                <li><strong>Luxury Standards:</strong> The perfect blend of comfort, elegance, and sophistication</li>
                            </ul>

                            <div style="background: #764ba2; color: white; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center;">
                                <h3 style="margin: 0 0 10px;">Your Account Details</h3>
                                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                                ${subscribeNewsletter ? '<p style="margin: 15px 0 0; font-size: 14px; opacity: 0.9;">✉️ You\'re subscribed to our newsletter for exclusive offers!</p>' : ''}
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.WEBSITE_URL || 'http://localhost:3000'}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; 
                                          font-weight: bold; font-size: 16px;">
                                    Explore Our Properties
                                </a>
                            </div>

                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px;">
                                <h4 style="color: #667eea; margin: 0 0 10px;">Our Story</h4>
                                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                                    Founded with a vision to redefine luxury hospitality, RoyalStay comes from Sanskrit: 
                                    'Siri' meaning wealth and prosperity, and 'Nilaya' meaning home or dwelling. 
                                    Together, they represent our commitment to providing peaceful, luxurious homes away from home.
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background: #333; color: white; padding: 20px 30px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold;">Ready to begin your journey?</p>
                            <p style="margin: 0 0 15px; font-size: 14px; opacity: 0.8;">
                                Contact us anytime for personalized recommendations and exclusive offers.
                            </p>
                            <div style="margin: 15px 0;">
                                <p style="margin: 5px 0; font-size: 14px;">📧 ${process.env.CONTACT_EMAIL || process.env.EMAIL_USER}</p>
                                <p style="margin: 5px 0; font-size: 14px;">🌐 ${process.env.WEBSITE_URL || 'www.RoyalStay.com'}</p>
                            </div>
                            <hr style="border: none; border-top: 1px solid #555; margin: 20px 0;">
                            <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                                &copy; ${new Date().getFullYear()} RoyalStay. Redefining luxury hospitality with peaceful, luxurious homes away from home.
                            </p>
                        </div>
                    </div>
                `
      };

      await transporter.sendMail(welcomeEmail);
      console.log(`Welcome email sent to ${email}`);

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration if email fails, just log it
    }

    res.status(201).json({
      message: "Signup successful! Welcome to RoyalStay - check your email for more details.",
      success: true
    });

  } catch (err) {
    // Debugging log
    console.error("Error in signup:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

// Login
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = 'Auth failed email or password is wrong';

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Compare password
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Generate JWT
    const token = generateToken(user);

    // Set cookie with proper configuration
    res.cookie("UserToken", token, {
      httpOnly: true,
      secure: false,       // ⚠️ only for localhost
      sameSite: "lax",    // 🔑 must be "none" for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.status(200).json({
      message: "Login Success",
      success: true,
      token: token,
      email,
      firstname: user.firstName,
      lastname: user.lastName,
      phone: user.phone,
      rememberMe
    })
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

const logout = (req, res) => {
  res.clearCookie("UserToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out", success: false });
    }
    res.json({ message: "Logged out successfully", success: true });
  });
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in session
    req.session.forgotOtp = otp;
    req.session.forgotEmail = email;

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
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpire: { $gt: Date.now() } // not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Google callback controller (for Passport)
export const googleCallback = (req, res) => {
  try {
    console.log('✅ Google OAuth successful, user:', req.user);

    // Generate JWT token
    const token = generateToken(req.user);

    // Set cookie with proper configuration
    res.cookie('UserToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('✅ UserToken cookie set for user:', req.user._id);

    // Redirect to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:8080');

  } catch (error) {
    console.error('❌ Error in Google callback:', error);
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:8080?error=auth_failed');
  }
};

// Google HandleCallback
const handleCallback = async (req, res) => {
  console.log('=== Google OAuth Callback Started ===');
  console.log('Query parameters:', req.query);
  console.log('Cookies received:', req.cookies);

  const { code, state } = req.query;
  const storedState = req.cookies.google_oauth_state;
  const codeVerifier = req.cookies.google_oauth_code_verifier;

  console.log('State from query:', state);
  console.log('Stored state from cookie:', storedState);
  console.log('Code verifier from cookie:', codeVerifier ? 'Exists' : 'Missing');

  if (state !== storedState) {
    console.log('❌ State mismatch!');
    return res.status(400).send("Invalid state parameter");
  }

  let tokens;
  try {
    console.log('Validating authorization code...');
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
    console.log('✅ Authorization code validated successfully');
  } catch (error) {
    console.error("❌ Error validating authorization code:", error);
    return res.status(500).send("Error during Google OAuth callback");
  }

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email, picture } = claims;

  console.log('Google user claims:', { googleUserId, name, email, picture, avatar });

  // Normalize email (to avoid duplicates due to case differences)
  const emailLower = (email || "").trim().toLowerCase();
  console.log('Normalized email:', emailLower);

  try {
    console.log('Searching for user in database...');
    // First, check if a user exists with this googleId or email
    let user = await UserModel.findOne({
      $or: [{ email: emailLower }, { googleId: googleUserId }],
    });

    console.log('User found in database:', user ? user._id : 'None');

    if (user) {
      console.log('Existing user found, updating...');
      // If found by email but no googleId → link it
      if (!user.googleId) {
        console.log('Linking Google ID to existing user');
        user.googleId = googleUserId;
      } else if (user.googleId !== googleUserId && user.email === emailLower) {
        console.log('❌ Google account conflict detected');
        // Edge case: account already linked with another GoogleId
        return res.status(409).json({
          success: false,
          message: "This email is already linked to a different Google account.",
        });
      }

      // Update fields
      if (avatar) user.picture = avatar;
      if (!user.name && name) user.name = name;
      if (!user.email && emailLower) user.email = emailLower;

      await user.save();
      console.log('✅ User updated successfully');
    } else {
      console.log('No existing user found, checking for duplicate email...');
      // Before creating, check again for duplicate email (race condition safe)
      const existingEmail = await UserModel.findOne({ email: emailLower });
      if (existingEmail) {
        console.log('❌ Duplicate email found:', existingEmail._id);
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists. Please log in instead.",
        });
      }
      console.log('Creating new user...');
      // No existing user → create new
      user = await UserModel.create({
        googleId: googleUserId,
        name: name || "",
        email: emailLower || undefined,
        termsAccepted: true,
        subscribeNewsletter: false,
        picture: avatar || "",
      });
      console.log('✅ New user created:', user._id);
    }

    console.log('Generating JWT token...');
    const token = generateToken(user);
    console.log('Token generated successfully');

    // Set cookie with proper configuration
    console.log('Setting UserToken cookie...');
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24 * 7, // 1 week
      path: '/'
    };
    console.log('Cookie options:', cookieOptions);

    res.cookie('UserToken', token, cookieOptions);
    console.log('✅ UserToken cookie set');

    // Clear OAuth cookies
    console.log('Clearing OAuth cookies...');
    res.clearCookie('google_oauth_state', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    res.clearCookie('google_oauth_code_verifier', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    console.log('✅ OAuth cookies cleared');

    // Check if cookie was actually set in response headers
    console.log('Response headers being sent:');
    const headers = res.getHeaders();
    Object.keys(headers).forEach(key => {
      if (key.toLowerCase().includes('cookie') || key.toLowerCase().includes('set-cookie')) {
        console.log(`Header: ${key} = ${headers[key]}`);
      }
    });

    console.log('=== Google OAuth Callback Completed Successfully ===');

    return res.status(200).json({
      message: "Google OAuth successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });



  } catch (err) {
    console.error('❌ Error in Google OAuth handleCallback:', err);

    // Handle duplicate key errors gracefully
    if (err?.code === 11000) {
      console.log('❌ Duplicate key error:', err.keyValue);
      return res.status(409).json({
        success: false,
        message: "Duplicate account conflict, please try logging in instead.",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err.message
    });
  }
};

const update_user = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};


export { signup, login, logout, forgotPassword, resetPassword, handleCallback, update_user };
// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/auth/google/callback",
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 === GOOGLE PROFILE DEEP DEBUG ===');
    
    // Debug the entire profile structure
    console.log('Profile keys:', Object.keys(profile));
    console.log('Profile fields:');
    console.log('- id:', profile.id);
    console.log('- displayName:', profile.displayName);
    console.log('- provider:', profile.provider);
    
    // Debug emails
    if (profile.emails && profile.emails.length > 0) {
      console.log('- emails:', profile.emails);
      profile.emails.forEach((email, index) => {
        console.log(`  Email ${index}:`, email.value);
      });
    } else {
      console.log('- emails: NONE');
    }
    
    // Debug photos
    if (profile.photos && profile.photos.length > 0) {
      console.log('- photos:', profile.photos);
      profile.photos.forEach((photo, index) => {
        console.log(`  Photo ${index}:`, photo.value);
      });
    } else {
      console.log('- photos: NONE');
    }
    
    // Debug raw JSON (_json field)
    if (profile._json) {
      console.log('- _json keys:', Object.keys(profile._json));
      console.log('- _json content:');
      for (const [key, value] of Object.entries(profile._json)) {
        if (typeof value === 'string' && value.length < 100) {
          console.log(`  ${key}:`, value);
        } else if (typeof value === 'object') {
          console.log(`  ${key}:`, JSON.stringify(value));
        }
      }
    } else {
      console.log('- _json: NONE');
    }
    
    console.log('====================================');

    const email = profile.emails[0].value.toLowerCase();
    
    // MANUALLY check all possible picture locations
    let avatar = null;
    const possiblePictureLocations = [
      profile.photos?.[0]?.value,
      profile._json?.picture,
      profile._json?.image?.url,
      profile._json?.photo,
      profile._json?.thumbnail,
      profile._json?.imageUrl,
      profile._json?.avatar_url,
      profile._json?.profile_image_url
    ];
    
    console.log('🔎 Checking possible picture locations:');
    possiblePictureLocations.forEach((location, index) => {
      if (location) {
        console.log(`  Location ${index}: FOUND -`, location);
        if (!avatar) avatar = location; // Use first found
      } else {
        console.log(`  Location ${index}: NOT FOUND`);
      }
    });
    
    if (avatar) {
      console.log('✅ Selected avatar:', avatar);
    } else {
      console.log('❌ No avatar found in any location');
    }
    
    // Find user by googleId or email
    let user = await UserModel.findOne({ 
      $or: [
        { googleId: profile.id },
        { email: email }
      ]
    });

    if (user) {
      console.log('Existing user found:', user._id);
      
      // Update existing user
      if (!user.googleId) {
        user.googleId = profile.id;
        console.log('Linked Google ID to existing user');
      }
      
      // Update avatar if found
      if (avatar) {
        user.avatar = avatar;
        console.log('Updated avatar:', user.avatar);
      }
      
      await user.save();
      return done(null, user);
    }

    // Create new user
    const newUserData = {
      googleId: profile.id,
      email: email,
      name: profile.displayName,
      termsAccepted: true,
      subscribeNewsletter: false,
      isActive: true
    };

    // Add avatar if found
    if (avatar) {
      newUserData.avatar = avatar;
    }

    console.log('Creating user with data:', newUserData);
    
    user = await UserModel.create(newUserData);
    console.log('✅ New user created via Google OAuth:', user._id);
    
    done(null, user);
    
  } catch (err) {
    console.error('❌ Passport Google strategy error:', err);
    done(err, null);
  }
}));

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
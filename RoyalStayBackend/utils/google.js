import { Google } from "arctic";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Google OAuth2 client
export const google = new Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:8080/auth/google/callback"
});

// utils/profileUtils.js
export const getGoogleProfilePicture = (profile) => {
  // Try different possible locations for the profile picture
  if (profile.photos && profile.photos.length > 0) {
    return profile.photos[0].value;
  }
  
  if (profile._json && profile._json.picture) {
    return profile._json.picture;
  }
  
  if (profile._json && profile._json.image && profile._json.image.url) {
    return profile._json.image.url;
  }
  
  // Check for additional possible locations
  if (profile._json && profile._json.photo) {
    return profile._json.photo;
  }
  
  if (profile._json && profile._json.thumbnail) {
    return profile._json.thumbnail;
  }
  
  console.log('No profile picture found in:', Object.keys(profile._json || {}));
  return null;
};

//export default google;

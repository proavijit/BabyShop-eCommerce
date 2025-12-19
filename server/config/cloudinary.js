import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Immediate verification
console.log("=== ENV CHECK ===");
console.log("CLOUDINARY_URL exists:", !!process.env.CLOUDINARY_URL);
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY);
console.log("=================");

console.log("DEBUG: Cloudinary.js - Process ENV CLOUDINARY_URL exists:", !!process.env.CLOUDINARY_URL);

// Configure cloudinary - Support both naming conventions
const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

console.log("--- Cloudinary Config Boot ---");
if (cloudinaryUrl) {
  console.log("CLOUDINARY_URL found in process.env");
  console.log("URL Length:", cloudinaryUrl.length);

  // Defensive manual parsing
  try {
    // Replace cloudinary:// with https:// for URL constructor to parse correctly
    const urlObj = new URL(cloudinaryUrl.replace('cloudinary://', 'https://'));
    const parsedApiKey = urlObj.username;
    const parsedApiSecret = urlObj.password;
    const parsedCloudName = urlObj.hostname;

    if (parsedApiKey && parsedApiSecret && parsedCloudName) {
      cloudinary.config({
        cloud_name: parsedCloudName,
        api_key: parsedApiKey,
        api_secret: parsedApiSecret,
        secure: true
      });
      console.log(`✅ Configured via CLOUDINARY_URL. Cloud Name: ${parsedCloudName}`);
      console.log(`API Key prefix: ${parsedApiKey.substring(0, 4)}... (length: ${parsedApiKey.length})`);
      console.log(`API Secret prefix: ${parsedApiSecret.substring(0, 4)}... (length: ${parsedApiSecret.length})`);
    } else {
      throw new Error("Missing parts in CLOUDINARY_URL");
    }
  } catch (err) {
    console.error(`❌ Error parsing CLOUDINARY_URL: ${err.message}. Falling back to individual keys.`);
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  }
} else {
  console.warn("⚠️ No CLOUDINARY_URL found. Using individual keys.");
  console.log(`Cloud Name from env: ${cloudName || 'NOT FOUND'}`);
  console.log(`API Key from env: ${apiKey ? apiKey.substring(0, 4) + '...' : 'NOT FOUND'}`);
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

const finalConfig = cloudinary.config();
const finalCloudName = finalConfig.cloud_name;
const finalApiKey = finalConfig.api_key;
const finalApiSecret = finalConfig.api_secret;

if (finalCloudName && finalCloudName !== 'disabled') {
  console.log("✅ Cloudinary configuration successful.");
  console.log("Final Cloud Name:", finalCloudName);
  console.log(`Final API Key prefix: ${finalApiKey ? finalApiKey.substring(0, 4) + '...' : 'NOT SET'} (length: ${finalApiKey ? finalApiKey.length : 0})`);
  console.log(`Final API Secret prefix: ${finalApiSecret ? finalApiSecret.substring(0, 4) + '...' : 'NOT SET'} (length: ${finalApiSecret ? finalApiSecret.length : 0})`);
} else {
  console.error("❌ Cloudinary configuration failed: Missing or invalid cloud_name.");
  console.log("Final Cloud Name State:", finalCloudName || "NOT SET");
}
console.log("--- End Cloudinary Config ---");

export default cloudinary;
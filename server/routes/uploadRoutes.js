import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an image');
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    try {
        console.log('--- Cloudinary Upload Attempt ---');
        const currentConfig = cloudinary.config();
        console.log('Cloud Name:', currentConfig.cloud_name);
        console.log('API Key exists:', !!currentConfig.api_key);
        console.log('API Secret exists:', !!currentConfig.api_secret);
        console.log('Base64 length:', fileStr.length);

        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'avatars', // Simplified folder name
            upload_preset: 'ml_default',
            resource_type: 'auto'
        });

        res.status(200).json({
            success: true,
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        });
    } catch (error) {
        console.error('Cloudinary Upload Error Details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary',
            error: error.message,
            details: error
        });
    }
}));

export default router;

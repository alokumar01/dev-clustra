import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../../config/env.js";
import ApiError from "../../helpers/apiError.js";

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CONFIG.cloud_name,
    api_key: CLOUDINARY_CONFIG.api_key,
    api_secret: CLOUDINARY_CONFIG.api_secret,
});

// 2. Setup Multer Bouncer (Memory Storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Only allow common image formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Only .png, .jpg, .jpeg and .webp formats are allowed!"), false);
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB for avatars
    fileFilter
});

// 3. The Cloudinary Middleware (The "Uploader")
export const uploadToCloudinary = async (req, res, next) => {
    try {
        if (!req.file) return next(); // Move on if no file is uploaded

        // Use a stream to send the buffer to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "avatars", // Organized folder in Cloudinary
                resource_type: "image",
                transformation: [
                    { width: 500, height: 500, crop: "limit" }, // Resize to reasonable size
                    { quality: "auto" } // Auto compress
                ],
            },
            (error, result) => {
                if (error) {
                    return next(new ApiError(500, "Cloudinary Upload Failed"));
                }
                // Attach the result to req.file so the controller can use the URL
                req.file.cloudinaryUrl = result.secure_url;
                req.file.cloudinaryId = result.public_id;
                next();
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        next(error);
    }
};
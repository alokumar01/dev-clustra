import ApiError from "../../helpers/apiError.js";
import User from "../user/user.model.js"
import { v2 as cloudinary } from "cloudinary";
import { searchUsersService } from "./user.service.js";

export const updateAvatarController = async (req, res, next) => {
    try {
        //checking the middleware getting url or not
        if (!req.file || !req.file.cloudinaryUrl) {
            throw new ApiError(400, "No image uploaded");
        }

        //to delte the image we need to find the user as well
        //NOTE, do not implemtned business logic here send this part into services, 
        //TODO:send this into businness logic into services
        const user = await User.findById(req.user._id);

        const oldPublicId = user.avatarPublicId;

        //update the user
        user.avatar = req.file.cloudinaryUrl;
        user.avatarPublicId = req.file.cloudinaryId
        await user.save();

        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId);
        }

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully!"
        })
    } catch (error) {
        next(error);
    }
}

//search users controller
export const searchUsersController = async (req, res, next) => {
    try {
        const query = req.query.query; //yeah object return karta hai, if you want to access it like string then use req.query.query
        const currentUser = req.user._id;

        if (!query) {
            return res.status(200).json({ success: true, data: [] });
        }

        const users = await searchUsersService(query, currentUser);

        res.status(200).json({
            success: true,
            message: "List of all data",
            data: users
        });
            
    } catch (error) {
        next(error);
    }
}


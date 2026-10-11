import ApiError from "../../helpers/apiError.js";
import {
    checkUsernameService,
    searchUsersService,
    updateAvatarService,
} from "./user.service.js";

export const updateAvatarController = async (req, res, next) => {
    try {
        if (!req.file || !req.file.cloudinaryUrl) {
            throw new ApiError(400, "No image uploaded");
        }

        await updateAvatarService({
            userId: req.user._id,
            avatarUrl: req.file.cloudinaryUrl,
            avatarPublicId: req.file.cloudinaryId,
        });

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
        if (typeof query !== "string" || query.trim().length > 50) {
            throw new ApiError(400, "Search query is invalid", "INVALID_SEARCH_QUERY");
        }

        const users = await searchUsersService(query.trim(), currentUser);

        res.status(200).json({
            success: true,
            message: "List of all data",
            data: users
        });

    } catch (error) {
        next(error);
    }
}

// Check username availability

export const checkUsernameController = async (req, res, next) => {
    try {
        const { username } = req.validatedData;

        const { available } = await checkUsernameService(username);

        res.status(200).json({
            success: true,
            // message: "Username availabity check",
            available
        })

    } catch (error) {
        next(error);
    }
}

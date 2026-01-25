import User from "./user.model.js"
import ApiError from "../../helpers/apiError.js"

export const searchUsersService = async (searchTerm, currentUserId) => {
    const query = {
        $and: [
            {_id: { $ne: currentUserId } }, //Rule 1: not inlcude own
            {
                $or: [
                    { username: { $regex: searchTerm, $options: 'i'} }, // match usernmae
                    { email: { $regex: searchTerm, $options: 'i'} }, //match email
                ]
            }
        ]
    }

    return await User.find(query).select("username avatar bio"); // select the public field only
};
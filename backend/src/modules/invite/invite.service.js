import ApiError from "../../helpers/apiError.js"
import User from "../user/user.model.js"


export const generateInviteService = async({ userId }) => {

    const user = await User.findById(userId);
    if (!user)
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    


}


export const verifyInviteService = async() => {

}

export const acceptInviteService = async() => {

}

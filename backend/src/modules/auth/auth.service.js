import bcrypt from "bcryptjs";
import User from "../user/user.model.js"
import ApiError from "../../helpers/apiError.js";

export const signupService = async({ username, email, password })  => { // service object receive karti hai 
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existingUser) {
        throw new ApiError(409, "User already exist!", "USER_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        passwordHash,
    });
    
    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
};
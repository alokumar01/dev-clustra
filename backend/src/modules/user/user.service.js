import User from "./user.model.js"



/// BUG THE RESULT SHOULD BE ONLY INCLUDE THE RESULTS FROM OWN CHAT NOT GLOBAL, DONT RETURN GLOBAL USERNAME
export const searchUsersService = async (searchTerm, currentUserId) => {
    const query = {
        $and: [
            {_id: { $ne: currentUserId } }, //Rule 1: not inlcude own
            {
                $and: [
                    { username: { $regex: searchTerm, $options: 'i'} }, // match usernmae
                    // { email: { $regex: searchTerm, $options: 'i'} }, //match email
                ]
            }
        ]
    }

    return await User.find(query).select("username avatar bio"); // select the public field only
};

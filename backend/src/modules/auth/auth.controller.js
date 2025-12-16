import { signupService } from "./auth.service.js";


export const signupController = async (req, res, next) => { // Controller ka kaam hai HTTP data extract karna
    try {
        const {username, email, password}  = req.body;
        
        const user = await signupService({ username, email, password });
        
        res.status(201).json({
            success: true,
            message: "Signup Successful",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
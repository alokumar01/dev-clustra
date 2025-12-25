import ApiError from "../helpers/apiError.js"

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            code: err.code,
            details: err.details,
        });
    }

    //falllback error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorMiddleware;
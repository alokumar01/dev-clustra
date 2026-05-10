import ApiError from "../helpers/apiError.js";

const errorMiddleware = (err, req, res) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            details: err.details,
        });
    }

    console.error(err); // useful for debugging

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorMiddleware;
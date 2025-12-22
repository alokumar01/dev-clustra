import {rateLimit} from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mintues
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 64,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many request. Please Try again later"
        });
    }
})

export default limiter
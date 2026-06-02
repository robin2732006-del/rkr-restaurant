const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token, access denied"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (error) {

        console.error("Auth Error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;
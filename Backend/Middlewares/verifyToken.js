import jwt from 'jsonwebtoken';



export const verifyToken = (req, res, next) => {
    const token = req.cookies.authentication_token;


    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized User==>No token available" });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized User==>Invalid token " });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}
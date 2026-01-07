const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    // DEBUG LINE GOES HERE INSIDE FUNCTION
    console.log("Incoming Auth Header:", req.headers['authorization']);

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ msg: "No Token Provided" });
    }

    try {

        // Expecting: Bearer <token>
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "opsmind-secret"
        );

        req.user = decoded;

        next();

    } catch(err) {

        res.status(401).json({ msg: "Invalid Token" });

    }

};

module.exports = verifyToken;

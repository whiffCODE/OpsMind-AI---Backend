const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.json({ msg: "Signup successful" });

    } catch(err) {
        res.status(500).json({ msg: err.message });
    }

};

const login = async (req, res) => {

    try {

        if (!req.body) {
            return res.status(400).json({ msg: "Request body missing" });
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "opsmind-secret",
            { expiresIn: '7d' }
        );

        res.json({ token });

    } catch(err) {
        res.status(500).json({ msg: err.message });
    }

};

// 👉 RIGHT HERE AT BOTTOM
module.exports = {
    signup,
    login
};

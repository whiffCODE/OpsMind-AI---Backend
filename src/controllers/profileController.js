const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("name email role");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

module.exports = { getProfile };

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

exports.addUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    const user = await newUser.save();

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user.email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `https://resetpasswordapp.netlify.app/reset-password/${token}`;
    const message = `You requested a password reset. Click here to reset your password: ${resetUrl}`;

    await sendEmail(user.email, "Password Reset", message);
    res.status(200).json({
      resetUrl,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 11);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

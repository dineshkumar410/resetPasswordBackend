const express = require("express");
const {
  addUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/user", addUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

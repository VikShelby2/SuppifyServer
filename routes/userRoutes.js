const express = require("express");
const { signupUser, loginUser, logoutUser , test } = require('../controllers/userController');
const { default: protectRoute } = require("../middlewares/protectRoute");
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;

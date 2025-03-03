const express = require("express");
const router = express.Router();
const { createNewPage } = require("../controllers/pageController");

// Route to create a new page
router.post("/create", createNewPage);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createNewPage } = require("../controllers/builder");
const { createNewTheme } = require("../controllers/builder");

// Route to create a new page
router.post("/createPage", createNewPage);
router.post('/createTheme' , createNewTheme )
module.exports = router;

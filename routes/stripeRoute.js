const express = require('express');
const router = express.Router();
const {createAccount} = require('../controllers/stripeController')

router.post('/connect' , createAccount)
module.exports = router;
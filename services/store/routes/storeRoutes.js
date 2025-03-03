// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/add-store', storeController.addStore);
router.post('/list-store' , storeController.listStores)
router.post('/setup-guide' , storeController.setupGuide)
router.put('/setup-guide-edit/:id' , storeController.setupGuideEdit)
router.post('/setup-guide-list' , storeController.listSetup)

module.exports = router;


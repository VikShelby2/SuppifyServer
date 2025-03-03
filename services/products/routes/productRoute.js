const express = require('express');
const router = express.Router();
const {addProduct, addTags, listTags, listTabs, addTab, editTabs, deleteTab, listCollection, addCollection, upload, updateProduct, listProducts, editCollection} = require('../controllers/productController');



router.post('/tags/add' , addTags)
router.post('/tags/list' , listTags)
router.post('/tabs/list' , listTabs)
router.post('/tabs/add' , addTab)
router.put('/tabs/edit' , editTabs)
router.delete('/tabs/delete' , deleteTab)
router.post('/collection/list' , listCollection)
router.post('/collection/add' , upload.single('photo') ,addCollection)
router.post('/add' , upload.array('photos'), addProduct)
router.put('/edit/:productId'  ,  upload.array('photos') , updateProduct)
router.post('/list' , listProducts)
router.put('/collection/edit' , editCollection)
module.exports =  router
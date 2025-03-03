const Store = require('../models/storeModel');
const Collection = require('../models/collectionModel.js') ;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const fs = require('fs');
const generateSVG = require("../utils/generateSvg.js");
const SetUpGuide = require('../models/setupModal.js');



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'bucket');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });
exports.addStore =  async (req, res) => {
    try {
       
        const { storeName, userId, storeLocation , storeCurrency  , locationFlag } = req.body; 
        const svgData = generateSVG(storeName)
        console.log(svgData)
        const store = new Store({ storeName, userId, storeLocation , svgData  , storeCurrency , locationFlag});
      
        await store.save();
        const defaultCollection = new Collection({
          storeId: store._id,
          collections: [{
          name: 'MyHome',
          description: 'Default collection'
          }]
        });
        await defaultCollection.save()
        console.log(defaultCollection)
        if (store) {
            return res.status(201).json({
                _id: store._id,
                storeName: store.storeName,
                storeLocation: store.storeLocation,
                userId: store.userId,
                svgData: store.svgData ,
                storeCurrency: storeCurrency ,
                locationFlag: locationFlag
            });
        }

        // Remove the following line
        // res.status(201).json({ message: 'Store added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.listStores = async (req , res) =>{
  try{
     const {userId} = req.body
     console.log('userasdasd' , userId)
     const stores = await Store.find({ userId });
     res.json(stores);
  
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching stores');
  }

}
exports.setupGuide = async (req, res) => {
  try {
    const criteria = { storeId: req.body.storeId }; // Adjust criteria based on your requirements
    const existingGuide = await SetUpGuide.findOne(criteria);

    if (existingGuide) {
      res.status(400).json({ message: 'Guide already exists' });
    } else {
      const newGuide = new SetUpGuide(req.body);
      const savedGuide = await newGuide.save();
      res.status(201).json(savedGuide);
    }

    console.log(req.body.storeId);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  
  

exports.setupGuideEdit = async (req, res) => {
  
    try {
        
        const updatedGuide = await SetUpGuide.findByIdAndUpdate(req.params.id , req.body, { new: true });
        res.json(updatedGuide);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
  };
  ;
  
  
exports.listSetup = async (req, res) => {
    try {
      const { storeId } = req.body;
      const setup = await SetUpGuide.findOne({ storeId });
  
      if (!setup) {
        return res.status(404).json({ error: 'Setup guide not found' });
      }
      return res.status(200).json(setup); // Send the setup guide as the response
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching setup guide' });
    }
  };
  
  
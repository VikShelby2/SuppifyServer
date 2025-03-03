const Product  = require('../models/productModel')
const Tag = require('../models/productTagsModel')
const Tabs = require('../models/productTabs')
const Collection = require('../models/collectionModel')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const path = require("path")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'bucket/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    fieldSize: 5 * 1024 * 1024, // 5MB max field size
  },
});
const addProduct = async( req,res ) =>{
  try {
    const {
      barcode,
      category,
      collections,
      comparePrice,
      costPerItem,
      description,
      publishing ,
      margin,
      price,
      profit,
      sku,
      status,
      tags,
      title,
      type,
      storeId,
      variants,
      vendor ,
      stock ,
      material ,
      ageRange ,
      condition ,
      gender ,
    } = req.body;

    // Handle photos
    const photos = req.files.map(file => ({
      url: `/bucket/${file.filename}`,
      caption: ""
    }));

    const product = new Product({
      barcode,
      category: JSON.parse(category),
      collections: JSON.parse(collections),
      comparePrice,
      costPerItem,
      description,
      stock,
      margin,
      photos,
      price,
      profit,
      sku,
      status,
      publishing: JSON.parse(publishing) ,
      tags: JSON.parse(tags),
      title,
      type,
      storeId,
      variants: JSON.parse(variants),
      vendor ,
      material ,
      ageRange ,
      condition ,
      gender ,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      barcode,
      category,
      collections,
      comparePrice,
      costPerItem,
      description,
      margin,
      price,
      profit,
      saleOnline,
      salePos,
      sku,
      sellNoStock , 
      vp ,
      bop ,
      status,
      tags,
      title,
      type,
      variants,
      vendor ,
      material ,
      ageRange ,
      condition ,
      gender , 
      stock ,

    } = req.body;

    // Handle photos
    const photos = req.files.map(file => ({
      url: `/bucket/${file.filename}`,
      caption: ""
    }));

    const updatedFields = {
      barcode,
      category: JSON.parse(category),
      collections: JSON.parse(collections),
      comparePrice,
      costPerItem,
      description,
      margin,
      photos,
      price,
      profit,
      saleOnline,
      salePos,
      sku,
      status,
      tags: JSON.parse(tags),
      title,
      type,
      variants: JSON.parse(variants),
      vendor ,
      material ,
      ageRange ,
      condition ,
      gender , 
      stock ,
    };

    // Remove undefined fields
    Object.keys(updatedFields).forEach(key => {
      if (updatedFields[key] === undefined) {
        delete updatedFields[key];
      }
    });

    const product = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const listProducts = async (req, res) => {
  try {
    const { storeId } = req.body;

    const products = await Product.find({ storeId });

    // Map through products and create an array of product data with photoUrl
    const productsWithImageUrls = [];

    for (const product of products) {
      if (product.photos && Array.isArray(product.photos)) { // Check if photos property is defined and is an array
        const photoUrls = product.photos.map(photo => {
          // Check if photo is an object and has a path property
          const photoPath = typeof photo === 'string' ? photo : photo.url;
          if (typeof photoPath !== 'string') {
            throw new Error('Invalid photo path');
          }
          const fullPath = path.join('./', photoPath);
          const photoData = fs.readFileSync(fullPath);
          const base64Image = Buffer.from(photoData).toString('base64');
          return `data:image/${path.extname(photoPath).substring(1)};base64,${base64Image}`;
        });

        // Return a new object with the existing product properties and the photoUrls array
        productsWithImageUrls.push({ ...product._doc, photoUrls });
      } else {
        // If there are no photos, include the product as is
        productsWithImageUrls.push(product._doc);
      }
    }

    res.json(productsWithImageUrls);
  } catch (error) {
    // Handle database query or processing error
    console.error(`Error fetching or processing products: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};



const editTabs = async (req , res) =>{
   const {tabId } = req.body
   const { newName } = req.body;
   try {
    const updatedTab = await Tabs.findByIdAndUpdate(tabId, { name: newName }, { new: true });

    if (!updatedTab) {
        return res.status(404).json({ error: 'Tab not found' });
    }

    res.json(updatedTab);

   }  catch (error) {
    console.error('Error updating tab:', error);
    res.status(500).json({ error: 'Server error' });
}
  
}
const deleteTab = async(req , res) =>{
  const { tabId } = req.body

  try {
      // Delete the tab from the database
      const deletedTab = await Tabs.findByIdAndDelete(tabId);

      if (!deletedTab) {
          return res.status(404).json({ error: 'Tab not found' });
      }

      res.json({ message: 'Tab deleted successfully' });
  } catch (error) {
      console.error('Error deleting tab:', error);
      res.status(500).json({ error: 'Server error' });
  }
}

const listTabs = async (req, res) => {
  const { storeId , type } = req.body;
  console.log('sdfsfs' + storeId)
  try {
    const tabs = await Tabs.find({ storeId  , table: type  });
    if (tabs) {
      res.status(200).json(tabs);
    } else {
      res.status(404).json({ error: 'No tabs found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addTab = async (req, res) => {
  const { name, storeId, table } = req.body;

  try {
    // Check if a tab with the same name, storeId, and table already exists
    const existingTab = await Tabs.findOne({ name, storeId, table });
    if (existingTab) {
      return res.status(400).json({ error: 'Tab already exists' });
    }

    // Create a new tab if it doesn't exist
    const newTab = new Tabs({ name, storeId, table });
    await newTab.save();
    res.status(201).json(newTab);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



const listTags = async(req , res) =>{
    const { userId } = req.body;
  try {
    const userTags = await Tag.findOne({ userId });
    if (!userTags) {
      return res.status(404).json({ tags: [] });
    }
    res.json({ tags: userTags.tags.map(tag => ({ id: tag, name: tag })) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
const addTags = async(req, res) =>{
    const { userId, tag } = req.body;
    try {
      let userTags = await Tag.findOne({ userId });
      if (!userTags) {
        userTags = new Tag({ userId, tags: [tag] });
      } else {
        if (!userTags.tags.includes(tag)) {
          userTags.tags.push(tag);
        } else {
          return res.status(400).json({ error: 'Tag already exists' });
        }
      }
      await userTags.save();
      res.json({ tag: { id: tag, name: tag } });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
}
const listCollection = async (req, res) => {
  try {
    // Fetch collections based on a storeId, or fetch all collections if no storeId is provided
    const { storeId } = req.body;

    let collections;
    if (storeId) {
      // Find collections for a specific storeId
      collections = await Collection.findOne({ storeId });

      if (!collections) {
        return res.status(404).json({ message: 'No collections found for this store' });
      }
    } else {
      // Fetch all collections from all stores
      collections = await Collection.find({});
    }

    // Convert photos to Base64
    if (collections && collections.collections) {
      collections.collections = await Promise.all(
        collections.collections.map(async (collection) => {
          if (collection.photo && Array.isArray(collection.photo)) {
            console.log('Processing photos:', collection.photo);

            try {
              // Iterate over the array of photos
              for (const photo of collection.photo) {
                if (photo.url) {
                  const photoPath = path.join('./', photo.url);
                  const fullPath = path.resolve(photoPath); // Use path.resolve for an absolute path
                  
                  const photoData = await fs.promises.readFile(fullPath);
                  const base64Image = Buffer.from(photoData).toString('base64');

                  // Update the photo URL to a base64 data URL
                  photo.url = `data:image/${path.extname(fullPath).substring(1)};base64,${base64Image}`;
                }
              }
            } catch (error) {
              console.error('Error processing the image:', error);
              // Handle error or set photo URLs to null
              collection.photo.forEach(photo => photo.url = null);
            }
          } else if (collection.photo && collection.photo.url) {
            try {
              // Handle the case when `collection.photo` is a single object with a `url`
              const photoPath = collection.photo.url;
              const fullPath = path.resolve(photoPath);
              const photoData = await fs.promises.readFile(fullPath);
              const base64Image = Buffer.from(photoData).toString('base64');
              
              collection.photo.url = `data:image/${path.extname(fullPath).substring(1)};base64,${base64Image}`;
            } catch (error) {
              console.error('Error processing the image:', error);
              collection.photo.url = null;
            }
          }
          return collection;
        })
      );
    }

    console.log('Collections processed:', collections);
    res.status(200).json({ collections });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const addCollection = async(req, res) =>{
  const { storeId, name, description  , condition , products , publishingChannels} = req.body;
  const file = req.file; // Using req.file to get a single file
  console.log(req.body , 'asdas')
    let photo = null;
    if (file) {
      photo = {
        url: `/bucket/${file.filename}`, // Assuming you want to save the file path
        caption: "", // Initialize with an empty caption
      };
    }
 console.log(products , 'sdfsdfd')
  try {
    // Find the collection by storeid
    let collection = await Collection.findOne({ storeId });

    if (!collection) {
      // If no collection exists for this storeid, create a new one
      collection = new Collection({ storeId, collections: [{ name, description  , condition: JSON.parse(condition) , products , publishingChannels:  JSON.parse(publishingChannels) , photo }] });
    } else {
      // If collection exists, add the new collection to the array
      collection.collections.push({ name, description  , condition: JSON.parse(condition) , products , publishingChannels:  JSON.parse(publishingChannels) , photo});
    }

    // Save the collection
    await collection.save();

    res.status(200).json({ message: 'Collection added successfully', collection });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
const editCollection = async (req, res) => {
  const { collectionId, name, description, condition, products } = req.body;

  try {
    // Find the collection by the internal collectionId
    const collection = await Collection.findOneAndUpdate(
      { 'collections._id': collectionId },
      {
        $set: {
          'collections.$.name': name,
          'collections.$.description': description,
          'collections.$.condition': condition,
          'collections.$.products': products
        }
      },
      { new: true } // Return the updated document
    );

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json({ message: 'Collection updated successfully', collection });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
    addProduct ,
    upload,
    addTags ,
    listTags ,
    addTab ,
    listTabs ,
    editTabs ,
    deleteTab ,
    listCollection ,
    addCollection ,
    updateProduct ,
    listProducts , 
    editCollection
}
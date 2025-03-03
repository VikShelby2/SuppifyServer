// models/Collection.js

const mongoose = require('mongoose');
const photoSchema = new mongoose.Schema({
  url: String,
  caption: String
})
const collectionSchema =  mongoose.Schema({
  storeId: { 
     type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
    required: true,
    unique: true,
  
  },
  collections: [
    {
      name: {
        type: String,
        required: true ,
        unique: true
      },
      description: {
        type: String,
        required: true
      } , 
      condition:  [{
        name: {
          type: String,
        
        } ,
        condition: {
          type: String,
        
        } ,
        value: {
          type: String,
        
        }
      } ]
      ,
      products: {
        type: Number
      } ,
      photo: [photoSchema],
      publishingChannels:{
        PointOfSale: {
          type:Boolean
        } ,
        store: {
          type:Boolean
        } ,
        marketing:{
           localLocation:{
            type: String,
           
          },
           International:{
            type:Boolean
          }
        }
      }
    }
  ]
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;

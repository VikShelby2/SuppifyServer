const mongoose = require("mongoose");
const photoSchema = new mongoose.Schema({
  url: String,
  caption: String
});

const optionValueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    type: String, // Store photo URL or file path
  },
  price: {
    type: Number,
    
  },
  compareAt: {
    type: Number
  },
  sku: {
    type: String
  },
  barcode: {
    type: String
  } ,
  quantity: {
    type: Number
  } , 
  sellWithoutStock: {
    type: Boolean ,
    default: false
  } ,
  location: {
    type: String
  } , 
  country: {
    type: String
  } ,
  weight: {
    type: String
  }
});
const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const MarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const PublishingSchema = new mongoose.Schema({
  channels: [ChannelSchema],
  markets: [MarketSchema]
});
// Variant Schema
const variantSchema = new mongoose.Schema({
  optionName: {
    type: String,
    required: true
  },
  optionValues: [optionValueSchema]
});

const productSchema = new mongoose.Schema({
  barcode: String,
  category: Object,
  collections: Array,
  comparePrice: String,
  costPerItem: String,
  description: String,
  margin: String,
  photos: [photoSchema],
  price: String,
  condition: String ,
  material: String ,
  ageRange:String ,
  gender:String,
  profit: String,
  sellNoStock: Boolean ,
  stock: {
    type: Number,
    default: 0
  } ,
  sku: String,
  status: {
    type: String,
    default: 'active' // Default value set to 'active'
  },
  tags: Array,
  title: {
    type: String,
    required: true
  },
  type: String,
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
    required: true
  },
  variants: [variantSchema],
  vendor: String ,
  publishing: PublishingSchema
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product

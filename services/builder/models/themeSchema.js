const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true }, 
    name: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    status:{ type: String },
    metadata: { type: Object }, // SEO metadata
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page'  , required:false  }] ,
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Theme", themeSchema);

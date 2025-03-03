const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true }, // Link to store
    name: { type: String, required: true },

    metadata: { type: Object }, // SEO metadata
    isPublished: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    pageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' , required: true  }] ,
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Theme", themeSchema);

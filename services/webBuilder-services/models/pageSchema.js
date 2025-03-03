const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    themeId: { type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true }, // Link to a Theme
    title: { type: String, required: true },
    content: { type: String }, // HTML or Markdown content
    metadata: { type: Object }, // SEO metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Page", pageSchema);

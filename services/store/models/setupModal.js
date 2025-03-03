const mongoose = require('mongoose');

const SetupGuideSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
    required: true ,
    unique: true 
  },
  product: { type: String, default: 'undone' },
  store: { type: String, default: 'undone' },
  stripe: { type: String, default: 'undone' },
  domain: { type: String, default: 'undone' },
  teams: { type: String, default: 'undone' },
  order: { type: String, default: 'undone' },
  supplier: { type: String, default: 'undone' },
});

module.exports = mongoose.model('SetupGuide', SetupGuideSchema);

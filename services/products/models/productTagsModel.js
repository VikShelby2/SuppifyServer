const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  tags: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Tag', TagSchema);

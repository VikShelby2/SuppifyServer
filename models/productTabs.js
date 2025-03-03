const mongoose = require('mongoose');

const TabsSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Store'
  },
  name:{
    type: String ,
    
  } , 
  table:{
    type: String ,
  }
});

module.exports = mongoose.model('Tabs', TabsSchema);
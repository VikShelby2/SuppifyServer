const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
    {
        storeName: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        themeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        storeLocation:{
           type: String ,
           required: false
        },
        photo:{
          type: String
        } ,
        svgData: { type: String, required: true }, 
        storeCurrency: {
            type: String
        } , 
        locationFlag: {
            type: String
        } , 

    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;

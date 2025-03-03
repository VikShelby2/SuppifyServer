const mongoose = require("mongoose");
require('dotenv').config(); 
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ [Products Service] MongoDB Connected...");
    } catch (error) {
        console.error("❌ [Products Service] MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

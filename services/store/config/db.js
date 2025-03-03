const mongoose = require("mongoose");
require('dotenv').config(); 
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/store', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ [Store Service] MongoDB Connected...");
    } catch (error) {
        console.error("❌ [Store Service] MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

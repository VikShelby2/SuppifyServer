const mongoose = require("mongoose");
require('dotenv').config(); 
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/builder', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ [WebBuilder Service] MongoDB Connected...");
    } catch (error) {
        console.error("❌ [WebBuilder Service] MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

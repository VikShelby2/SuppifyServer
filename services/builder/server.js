// server.js
const path = require("path")
const express = require('express');
const connectDB = require('./config/db');
const  dotenv  = require("dotenv")
const cookieParser  = require("cookie-parser")
dotenv.config();
const builderRoutes = require('./routes/routes')
const app = express();

//Start mongodb
 connectDB();
 
 //middlewares
 const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Enable credentials (cookies) to be sent and received
};

 app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
 app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
 app.use(cookieParser());
 app.use("/api/builder", builderRoutes);



const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// server.js
const path = require("path")
const express = require('express');
const connectDB = require('./db/mongodb');
const  dotenv  = require("dotenv")
const cookieParser  = require("cookie-parser")
const userRoutes = require('./routes/userRoutes')
const cors = require('cors');
const { protectRoute } = require('./middlewares/protectRoute');
const storeRoute = require('./routes/storeRoutes')
const productRoute = require("./routes/productRoute");
const  mongoose  = require("mongoose");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const stripeRoutes = require('./routes/stripeRoute')

const { createProxyMiddleware } = require("http-proxy-middleware");
dotenv.config();

const app = express();

//Start mongodb
 connectDB();
 
 //middlewares
 const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Enable credentials (cookies) to be sent and received
};





app.use((req, res, next) => {
  console.log(`Proxy received: 
     ${req.method} 
     ${req.url} 
     ${req.body}`);
  next();
});

 app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
 app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
 app.use(cookieParser());
 app.use("/api/builder", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));
 app.use(cors(corsOptions))
 // Routes 
 app.use("/api/product", productRoute);
 app.use("/api/users", userRoutes);
 app.use('/api/stripe' , stripeRoutes)

 app.use("/api/" , storeRoute);
 app.get('/api/protected', protectRoute, (req, res) => {
    res.send('This is a protected route');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

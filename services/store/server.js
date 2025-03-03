const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser  = require("cookie-parser")
const storeRoute = require("./routes/storeRoutes");
const { protectRoute } = require('../../middlewares/protectRoute');
dotenv.config();
const app = express();

connectDB();
app.use(express.json({ limit: '10mb' })); 

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("http://localhost:3000")) {
      callback(null, true); // Allow all requests from localhost:3000 (including subpaths)
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));


 app.use(express.urlencoded({ extended: true })); 
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(`Proxy received: 
       ${req.method} 
      ${req.get('origin')} 
       ${req.url} 
       ${req.body}`);
    next();
  });
  
app.use("/store/" , storeRoute)


const PORT = 5004;
app.listen(PORT, () => console.log(`Teams Service running on port ${PORT}`));




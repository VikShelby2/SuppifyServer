const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser  = require("cookie-parser")
const productRoute = require("./routes/productRoute");
dotenv.config();
const app = express();

connectDB();
app.use(express.json({ limit: '10mb' })); // Example: limit request body to 10MB
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8080"], // Allow frontend and main server
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
 app.use(express.urlencoded({ extended: true })); 
  app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Proxy received: ${req.method} ${req.url}`);
    next();
  });
  
app.use("/api/product" , productRoute)
const PORT = 5003;
app.listen(PORT, () => console.log(`Products Service running on port ${PORT}`));




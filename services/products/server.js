const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/productRoute");

dotenv.config();
const app = express();

// Connect MongoDB
connectDB();

// Middleware
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Product Service received: ${req.method} ${req.originalUrl}`);
    next();
});

// Product Routes
app.use("/api/product", productRoute);

const PORT = 5003;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));

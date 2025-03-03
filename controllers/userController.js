const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const Store = require('../models/storeModel');
const generateTokenAndSetCookie = require("../utils/helper/generateTokenAndSetCookie.js");
const generateSVG = require("../utils/generateSvg.js");
const Collection = require('../models/collectionModel')
const mongoose = require('mongoose');
  


const signupUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, username, password, storeName, storeLocation } = req.body;

        if (!name || !email || !username || !password || !storeName || !storeLocation) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const svgProfile = generateSVG(name);
        const svgData = generateSVG(storeName);

        if (!svgData || !svgProfile) {
            throw new Error("Failed to generate SVGs");
        }

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
            svg: svgProfile
        });
        await newUser.save({ session });

        const store = new Store({
            storeName,
            userId: newUser._id,
            storeLocation,
            svgData
        });
        await store.save({ session });

        const defaultCollection = new Collection({
            storeId: store._id,
            collections: [
                {
                    name: 'MyHome',
                    description: 'Default collection'
                }
            ]
        });
        await defaultCollection.save({ session });

        await session.commitTransaction();
        session.endSession();

        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username
            },
            store: {
                _id: store._id,
                storeName: store.storeName,
                storeLocation: store.storeLocation
            }
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
        console.error("Error in signupUser:", err.message);
    }
};


const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const isPasswordCorrect = await bcrypt.compare(password, user.password );

		if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });

		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}

		generateTokenAndSetCookie(user._id, res);
         
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			profilePic: user.profilePic,
			svg: user.svg
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in logoutUser: ", err.message);
	}
};

module.exports = {
	signupUser,
	loginUser,
	logoutUser,
};

const Page = require("../models/pageSchema");  
const { validatePageData } = require('../../../utils/helper')  

// Function to create a new page
const createNewPage = async (req, res) => {
    try {
        const { storeId, name, path, components, metadata } = req.body;

        // Validation
        const { error } = validatePageData({ storeId, name, path, components, metadata });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if the page already exists with the same path
        const existingPage = await Page.findOne({ storeId, path });
        if (existingPage) {
            return res.status(400).json({ message: "Page with this path already exists!" });
        }

        // Create the new page
        const newPage = new Page({
            storeId,
            name,
            path,
            components,
            metadata,
            isPublished: false, // Initially unpublished
        });

        await newPage.save();

        // Return the newly created page
        return res.status(201).json({ message: "Page created successfully!", page: newPage });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createNewPage };

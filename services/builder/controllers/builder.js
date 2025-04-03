const Page = require("../models/pageSchema");  
const { validatePageData } = require('../utils/helper/pageValdation');  
const Theme  = require('../models/themeSchema');
const readJsonFile = require("../utils/helper/getJsonData");

// Function to create a new page
const createNewPage = async (req, res) => {
    try {
        const { themeId, title, path, content, metadata } = req.body;

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
            themeId,
            title,
            path,
            content,
            metadata,
           
        });

        await newPage.save();

        // Return the newly created page
        return res.status(201).json({ message: "Page created successfully!", page: newPage });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
const createNewTheme = async (req, res) => {
  try {
    const { storeId, status, themeId, isDublicated, name, description, pages } = req.body;
    
    let newTheme;

    // If duplicating an existing theme
    if (isDublicated) {
      const theme = await Theme.findById(themeId);
      if (!theme) {
        return res.status(404).json({ message: 'Theme not found' });
      }
      newTheme = new Theme({
        name: theme.name,
        description: theme.description,
        storeId,
        status,
        version: theme.version,
        pages: theme.pages,
      });
    } else {
      // If not duplicating, create a new theme with the provided details
      newTheme = new Theme({
        name,
        description,
        storeId,
        status,
        pages,
      });
    }

    // Save the new theme to the database
    await newTheme.save();

    // Send a response indicating the new theme was created
    res.status(201).json({ message: 'New theme created successfully', newTheme });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

  
const createDefaultTheme = async (req, res) => {
    try {
        const { storeId } = req.body;
        const themeId = process.env.THEME_DEF_ID;
        const theme = await Theme.findById(themeId); 
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
              const defaultTheme = new Theme({
            name: theme.name,
            description: theme.description,
            storeId,
            status: "active",
            version: theme.version,
            pages: theme.pages,
            metadata: theme.metadata,
            isPublished: theme.isPublished,
        });
      
        await defaultTheme.save();

        res.status(201).json({ message: "Default theme created successfully", theme: defaultTheme });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { createNewPage  , createNewTheme , createDefaultTheme};

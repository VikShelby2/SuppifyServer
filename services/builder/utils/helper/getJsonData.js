const fs = require('fs');
const path = require('path');
/**
 * Asynchronously reads a JSON file and returns the parsed JSON data.
 * Uses the `fs.promises.readFile` API for a promise-based approach.
 * 
 * @param {string} filePath - The path to the JSON file to read.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON data.
 * @throws {Error} Throws an error if reading or parsing the file fails.
 */
function readJsonFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            callback(err, null);  // Pass error as first argument
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);  // Pass jsonData as second argument
        } catch (error) {
            console.error('Error parsing JSON:', error);
            callback(error, null);
        }
    });
}

module.exports = readJsonFile;

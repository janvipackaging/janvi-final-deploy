require('dotenv').config();
const mongoose = require('mongoose');
const { Location } = require('./models.js');

// Helper function to create a URL-friendly slug
const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// --- ADD ANY NEW LOCATIONS YOU WANT TO THIS LIST ---
const locationsToAdd = [
    // Add new Indian or Foreign cities here. Examples:
    // { city: 'Kathmandu', state: 'Bagmati Province', country: 'Nepal' },
    // { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka' }
];

// Process the list to add slugs
const processedLocations = locationsToAdd.map(loc => ({
    ...loc,
    slug: slugify(loc.city)
}));

async function addNewLocations() {
    if (processedLocations.length === 0) {
        console.log("No new locations to add. Please add cities to the 'locationsToAdd' array in this script.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully.");

        console.log(`Attempting to add ${processedLocations.length} new locations...`);
        const result = await Location.insertMany(processedLocations, { ordered: false }).catch(err => {
            if (err.code === 11000) { // Error code for duplicate key
                console.warn("Warning: Some duplicate entries were found and ignored.");
                return err.result.insertedIds.map((doc, index) => ({ _id: doc, ...processedLocations[index] }));
            } else {
                throw err; // Re-throw other types of errors
            }
        });
        
        const insertedCount = result ? result.length : 0;
        console.log(`Successfully added ${insertedCount} new locations.`);

    } catch (error) {
        console.error("An error occurred during the process:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
}

addNewLocations();
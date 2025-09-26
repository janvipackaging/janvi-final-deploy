require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./models.js');

// --- Final list of products with their assigned templates ---
const productsToAdd = [
    {
        name: 'Clear BOPP Film',
        slug: 'clear-bopp-film',
        templateName: 'clear_bopp_film_page',
        description: 'High-clarity film for general packaging and printing.',
        features: ['Excellent Transparency', 'Good Printability']
    },
    {
        name: 'CPP Film',
        slug: 'cpp-film',
        templateName: 'cpp_film_page',
        description: 'Cast Polypropylene film known for its softness and high clarity.',
        features: ['High Gloss', 'Excellent Seal Strength']
    },
    {
        name: 'HM Film',
        slug: 'hm-film',
        templateName: 'hm_film_page',
        description: 'High Molecular weight High-Density Polyethylene film.',
        features: ['High Strength', 'Lightweight']
    },
    {
        name: 'HST BOPP Film',
        slug: 'hst-bopp-film',
        templateName: 'hst_bopp_film_page',
        description: 'Heat Sealable Treated BOPP film for high-speed packaging.',
        features: ['Low Sealing Temperature', 'Strong Seals']
    },
    {
        name: 'LDPE Film',
        slug: 'ldpe-film',
        templateName: 'ldpe_film_page',
        description: 'Low-Density Polyethylene film offering flexibility and toughness.',
        features: ['High Flexibility', 'Waterproof']
    },
    {
        name: 'Metallized BOPP Film',
        slug: 'metallized-bopp-film',
        templateName: 'metallized_bopp_film_page',
        description: 'Offers superior barrier properties for extended shelf life.',
        features: ['Excellent Gas & Moisture Barrier', 'Reflective Appearance']
    },
    {
        name: 'Pearlised BOPP Film',
        slug: 'pearlised-bopp-film',
        templateName: 'pearlised_bopp_film_page',
        description: 'Opaque, high-gloss film for wrapping chocolates and soaps.',
        features: ['High Gloss Pearly Finish', 'Low Density']
    },
    {
        name: 'Polyester Film',
        slug: 'polyester-film',
        templateName: 'polyester_film_page',
        description: 'Durable and versatile Polyester films (PET films).',
        features: ['High Thermal Stability', 'Excellent Barrier Properties']
    },
    {
        name: 'Label Grade BOPP Film',
        slug: 'label-grade-bopp-film',
        templateName: 'label_grade_bopp_film_page',
        description: 'Engineered for high-quality, durable labels.',
        features: ['High Stiffness', 'Excellent Print Reception']
    },
    {
        name: 'Textile & Tape Grade BOPP', // This product will use the default template
        slug: 'textile-tape-grade-bopp',
        description: 'High-strength films for garment packaging and tapes.',
        features: ['High Tensile Strength', 'Puncture Resistant']
    }
];

async function updateProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully.");

        console.log("Deleting all old products...");
        await Product.deleteMany({});
        console.log("Old products deleted.");

        const result = await Product.insertMany(productsToAdd);
        console.log(`Successfully added ${result.length} final products.`);

    } catch (error) {
        console.error("Error updating products:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Database disconnected.");
    }
}

updateProducts();
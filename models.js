const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({ name: String, slug: String, description: String, features: [String], templateName: String });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');
const locationSchema = new mongoose.Schema({ city: String, slug: String, state: String, country: String });
const Location = mongoose.models.Location || mongoose.model('Location', locationSchema, 'locations');
module.exports = { Product, Location };
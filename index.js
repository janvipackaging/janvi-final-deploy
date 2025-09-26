require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Product, Location } = require('./models.js');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB."))
    .catch(err => { console.error("DB connection error:", err); process.exit(1); });
app.get('/', (req, res) => { res.render('index'); });
app.get('/products/:productSlug/all-locations', async (req, res) => {
    try {
        const { productSlug } = req.params;
        const product = await Product.findOne({ slug: productSlug });
        const locations = await Location.find({});
        if (!product) { return res.status(404).send('Product not found'); }
        res.render('hub_page', { product, locations });
    } catch (error) {
        console.error("Hub page error:", error);
        res.status(500).send('An error occurred');
    }
});
app.get('/products/:productSlug/:citySlug', async (req, res) => {
    try {
        const { productSlug, citySlug } = req.params;
        const product = await Product.findOne({ slug: productSlug });
        const location = await Location.findOne({ slug: citySlug });
        if (!product || !location) { return res.status(404).send('Page not found'); }
        const viewToRender = product.templateName ? product.templateName : 'product_page';
        res.render(viewToRender, { product, location });
    } catch (error) {
        console.error("Request error:", error);
        res.status(500).send('An error occurred');
    }
});
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });
}
module.exports = app;
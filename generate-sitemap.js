require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Product, Location } = require('./models.js');
async function generateAllSitemaps() {
    console.log("Starting sitemap generation...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected for sitemap generation.");
    const products = await Product.find({});
    const locations = await Location.find({});
    const publicDir = path.join(__dirname, 'public');
    const sitemapsDir = path.join(publicDir, 'sitemaps');
    if (!fs.existsSync(sitemapsDir)) { fs.mkdirSync(sitemapsDir, { recursive: true }); }
    for (const product of products) {
        const smStream = new SitemapStream({ hostname: 'https://cities.janvipackaging.online' });
        locations.forEach(location => {
            smStream.write({ url: `/products/${product.slug}/${location.slug}`, changefreq: 'weekly', priority: 0.8 });
        });
        smStream.end();
        const sitemapContent = await streamToPromise(smStream);
        fs.writeFileSync(path.join(sitemapsDir, `${product.slug}.xml`), sitemapContent);
        console.log(`Generated sitemap for ${product.name}`);
    }
    const hubSmStream = new SitemapStream({ hostname: 'https://cities.janvipackaging.online' });
    products.forEach(product => {
        hubSmStream.write({ url: `/products/${product.slug}/all-locations`, changefreq: 'monthly', priority: 0.9 });
    });
    hubSmStream.end();
    const hubSitemapContent = await streamToPromise(hubSmStream);
    fs.writeFileSync(path.join(publicDir, 'hub-pages-sitemap.xml'), hubSitemapContent);
    console.log('Generated sitemap for hub pages.');
    const smIndexStream = new SitemapStream({ hostname: 'https://cities.janvipackaging.online' });
    smIndexStream.write({ url: '/hub-pages-sitemap.xml' });
    products.forEach(product => {
        smIndexStream.write({ url: `/sitemaps/${product.slug}.xml` });
    });
    smIndexStream.end();
    const sitemapIndexContent = await streamToPromise(smIndexStream);
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexContent);
    console.log(`Generated sitemap index`);
    await mongoose.disconnect();
    console.log("Sitemap generation complete.");
}
generateAllSitemaps().catch(err => {
    console.error("Fatal error during sitemap generation:", err);
    process.exit(1);
});
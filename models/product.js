const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  productImage: { type: String },
  file: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String } // Optional field for subcategories
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

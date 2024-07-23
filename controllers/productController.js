const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const Product = require('../models/product');

// Ensure directory existence
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

// Multer storage configuration for images and files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Example path, adjust as needed
    ensureDirectoryExistence(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Keep the original file name
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  // Example mime types, adjust as needed
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF files are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({ storage, fileFilter }).fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);

const productController = {
  // Create a new product
  createProduct: async (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(400).json({ error: 'Error uploading files', details: err.message });
      }

      try {
        const { name, description, category, subcategory, features } = req.body;
        const productImagePath = req.files.productImage ? req.files.productImage[0].filename : '';
        const filePath = req.files.file ? req.files.file[0].filename : '';

        const newProduct = new Product({
          productImage: productImagePath,
          name,
          description,
          features: features || [], // Ensure `features` is an array
          file: filePath,
          category,
          subcategory // Add subcategory
        });

        await newProduct.save();

        // Construct HTTP URLs for frontend consumption with /app1 prefix
        const baseUrl = `${req.protocol}://${req.get('host')}/app1`;
        const productImageURL = productImagePath ? `${baseUrl}/uploads/${productImagePath}` : '';
        const fileURL = filePath ? `${baseUrl}/uploads/${filePath}` : '';

        // Modify the product object to include HTTP URLs
        newProduct.productImage = productImageURL;
        newProduct.file = fileURL;

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
      } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Error saving product', details: error.message });
      }
    });
  },

  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
  },

  // Get product features by ID
  getProductFeaturesById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).select('features');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product.features);
    } catch (error) {
      console.error('Error fetching product features:', error);
      res.status(500).json({ error: 'Error fetching product features', details: error.message });
    }
  },

  // Remove a product by ID
  removeProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Optionally, remove associated files
      const pathsToDelete = [product.productImage, product.file];
      pathsToDelete.forEach((filePath) => {
        if (filePath) {
          const fullPath = path.join(__dirname, '../uploads', filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });

      res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
      console.error('Error removing product:', error);
      res.status(500).json({ error: 'Error removing product', details: error.message });
    }
  },

  // Add features to a product by ID
  addFeaturesToProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { features } = req.body;

      // Find the product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Add new features to the existing ones
      if (features && Array.isArray(features)) {
        product.features = [...product.features, ...features];
      } else {
        return res.status(400).json({ error: 'Features must be provided as an array' });
      }

      // Save the updated product with new features
      await product.save();

      res.status(200).json({ message: 'Features added successfully', product });
    } catch (error) {
      console.error('Error adding features to product:', error);
      res.status(500).json({ error: 'Error adding features to product', details: error.message });
    }
  },

  // Get products by category and optional subcategory
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const products = await Product.find({ category });
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
  },

  // Get products by category and subcategory
  getProductsByCategoryAndSubcategory: async (req, res) => {
    try {
      const { category, subcategory } = req.params;
      const products = await Product.find({ category, subcategory });
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if `id` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID format' });
      }

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Construct HTTP URLs for frontend consumption with /app1 prefix
      const baseUrl = `${req.protocol}://${req.get('host')}/app1`;
      const productImageURL = product.productImage ? `${baseUrl}/uploads/${product.productImage}` : '';
      const fileURL = product.file ? `${baseUrl}/uploads/${product.file}` : '';

      // Modify the product object to include HTTP URLs
      product.productImage = productImageURL;
      product.file = fileURL;

      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ error: 'Error fetching product by ID', details: error.message });
    }
  },

  // Get product file by ID
  getProductFileById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product || !product.file) {
        console.error(`Product with ID ${id} not found or has no file.`);
        return res.status(404).json({ error: 'Product file not found' });
      }

      const filePath = path.join(__dirname, '../uploads', product.file);
      console.log(`Checking file path: ${filePath}`);

      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        console.error(`File not found on server at path: ${filePath}`);
        res.status(404).json({ error: 'File not found on server' });
      }
    } catch (error) {
      console.error('Error fetching product file:', error);
      res.status(500).json({ error: 'Error fetching product file', details: error.message });
    }
  }
};

module.exports = productController;

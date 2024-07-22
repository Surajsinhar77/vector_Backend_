const express = require("express");
const router = express.Router();
const quickEnquiryController = require("../controllers/quickEnquiryController.js");
const productController = require("../controllers/productController.js");
const imageController = require("../controllers/imagesController.js");
const { signup } = require("../controllers/authController.js");
const { login } = require("../controllers/loginController.js");

// Product routes
router.post("/products", productController.createProduct);
router.get("/getProductsById/:id", productController.getProductById);
router.get("/products/:category", productController.getProductsByCategory);
router.get("/products/:category/:subcategory", productController.getProductsByCategoryAndSubcategory);
router.get("/products", productController.getAllProducts);
router.get('/:id/features', productController.getProductFeaturesById);
router.get('/:id/file', productController.getProductFileById);
router.delete('/products/:id', productController.removeProduct);

// Image routes
router.post("/addImage", imageController.addImage);
router.get('/getAllImages', imageController.getAllImages);
router.delete('/images/:id', imageController.removeImage);

// Quick enquiry and auth routes
router.post("/quick-enquiry-form", quickEnquiryController.register);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;

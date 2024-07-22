const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Image = require('../models/image');

// Ensure directory existence
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

// Multer storage configuration for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Adjust path as needed
    ensureDirectoryExistence(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Keep the original file name
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG files are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({ storage, fileFilter }).single('headerImage');

// Controller methods
const imageController = {
  // Create an image
  async addImage(req, res, next) {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading header image:', err);
        return res.status(400).json({ error: 'Error uploading header image', details: err.message });
      }

      try {
        const headerImagePath = req.file ? `uploads/${req.file.filename}` : '';

        const newImage = new Image({
          headerImage: headerImagePath,
        });

        await newImage.save();

        // Construct HTTP URLs for frontend consumption
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const headerImageURL = `${baseUrl}/${headerImagePath}`;

        // Modify the image object to include HTTP URLs
        newImage.headerImage = headerImageURL;

        res.status(201).json({ message: 'Image created successfully', image: newImage });
      } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ error: 'Error saving image', details: error.message });
      }
    });
  },

  // Get all images
  async getAllImages(req, res) {
    try {
      const images = await Image.find();
      res.status(200).json(images.map(image => ({
        ...image.toObject(),
        headerImage: `${req.protocol}://${req.get('host')}/${image.headerImage}`
      })));
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Error fetching images', details: error.message });
    }
  },

  // Remove an image by ID
  async removeImage(req, res) {
    try {
      const { id } = req.params;

      // Check if the provided id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      const image = await Image.findByIdAndDelete(id);

      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Delete the image file from the server
      const imagePath = path.join(__dirname, '..', image.headerImage);
      if (image.headerImage && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: 'Image deleted successfully', image });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Error deleting image', details: error.message });
    }
  }
};

module.exports = imageController;

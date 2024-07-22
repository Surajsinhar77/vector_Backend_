// Image.js (Schema definition)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    headerImage: { type: String, required: true }, // Path or URL of header image
});

module.exports = mongoose.model('Image', imageSchema);

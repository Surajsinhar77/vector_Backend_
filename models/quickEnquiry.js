const mongoose = require("mongoose");

const quickEnquirySchema = new mongoose.Schema({
    businessname: { type: String, },
    price: { type: String,  },
    reservations: { type: String, },
    name: { type: String, required: true },
    phoneno: { type: String, required: true },
    email: { type: String, required: true,  },
    message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('QuickEnquiry', quickEnquirySchema);


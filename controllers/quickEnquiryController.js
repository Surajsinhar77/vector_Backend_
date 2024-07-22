const Joi = require('joi');
const CustomErrorHandler = require('../services/CustomErrorHandler');
const QuickEnquiry = require('../models/quickEnquiry');

const quickEnquiryController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      businessname: Joi.string().allow(null, '').optional(),
      price: Joi.string().allow(null, '').optional(),
      reservations: Joi.string().allow(null, '').optional(),
      name: Joi.string().min(3).max(30).required(),
      phoneno: Joi.string().length(10).required(),
      email: Joi.string().email().required(),
      message: Joi.string(),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { businessname, price, reservations, name, phoneno, email, message } = req.body;

    try {
      const newQuickEnquiry = new QuickEnquiry({
        businessname,
        price,
        reservations,
        name,
        phoneno,
        email,
        message,
      });

      const result = await newQuickEnquiry.save();
      if (result) {
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = quickEnquiryController;

const Joi = require('joi');

// Validate the incoming page data
const validatePageData = (data) => {
    const schema = Joi.object({
        storeId: Joi.string().required(),
        name: Joi.string().min(3).max(100).required(),
        path: Joi.string().min(3).max(100).required(),
        components: Joi.array().items(Joi.object()).optional(), // Array of components in JSON format
        metadata: Joi.object().optional(),  // Optional metadata (SEO, etc.)
    });

    return schema.validate(data);
};

module.exports = { validatePageData };
